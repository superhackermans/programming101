export default function middleware(request) {
  const url = new URL(request.url);

  // Allow favicon and static assets through
  if (url.pathname === '/favicon.svg') return;

  const basicAuth = request.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    try {
      const [, pwd] = atob(authValue).split(':');
      if (pwd === process.env.SITE_PASSWORD) {
        return;
      }
    } catch (e) {
      // Invalid base64
    }
  }

  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Programming Guide"',
    },
  });
}

export const config = {
  matcher: ['/((?!favicon\\.svg).*)'],
};
