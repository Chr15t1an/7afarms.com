// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://www.7afarm.com',
  'https://7afarm.com',
  'https://7afarm-com.pages.dev',
];

export async function onRequestPost(context) {
  const { request, env } = context;

  // Origin check
  const origin = request.headers.get('Origin') || '';
  const isLocalhost = origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1');
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) || isLocalhost ? origin : ALLOWED_ORIGINS[0];

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Referer/Origin validation — reject requests with no origin from non-localhost
  if (!origin && !isLocalhost) {
    return new Response(
      JSON.stringify({ error: 'Forbidden' }),
      { status: 403, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }

  try {
    const body = await request.json();
    const { name, email, phone, message, website } = body;

    // Honeypot check
    if (website) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Name, email, and message are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Please provide a valid email address.' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Check for required environment variables
    if (!env.SENDGRID_API_KEY || !env.CONTACT_EMAIL) {
      console.error('Missing SENDGRID_API_KEY or CONTACT_EMAIL environment variables');
      return new Response(
        JSON.stringify({ error: 'Server configuration error. Please try calling us instead.' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Send email via SendGrid
    const sendGridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: env.CONTACT_EMAIL }],
          subject: `New Contact Form Submission from ${name}`,
        }],
        from: {
          email: 'noreply@7afarm.com',
          name: '7A Farm Website',
        },
        reply_to: {
          email: email,
          name: name,
        },
        content: [{
          type: 'text/plain',
          value: [
            `Name: ${name}`,
            `Email: ${email}`,
            `Phone: ${phone || 'Not provided'}`,
            ``,
            `Message:`,
            message,
          ].join('\n'),
        }, {
          type: 'text/html',
          value: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Phone:</strong> ${escapeHtml(phone || 'Not provided')}</p>
            <hr>
            <p><strong>Message:</strong></p>
            <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
          `,
        }],
      }),
    });

    if (sendGridResponse.ok || sendGridResponse.status === 202) {
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    } else {
      const errorText = await sendGridResponse.text();
      console.error('SendGrid error:', sendGridResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to send message. Please try calling us instead.' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

  } catch (err) {
    console.error('Contact form error:', err);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred. Please try calling us instead.' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
