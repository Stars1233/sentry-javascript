import { V2_MetaFunction, LoaderFunction, json, defer, redirect } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import { withSentry } from '@sentry/remix';

export const meta: V2_MetaFunction = ({ data }) => [
  { charset: 'utf-8' },
  { title: 'New Remix App' },
  { name: 'viewport', content: 'width=device-width,initial-scale=1' },
  { name: 'sentry-trace', content: data.sentryTrace },
  { name: 'baggage', content: data.sentryBaggage },
];

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const type = url.searchParams.get('type');

  switch (type) {
    case 'empty':
      return {};
    case 'plain':
      return {
        data_one: [],
        data_two: 'a string',
      };
    case 'json':
      return json({ data_one: [], data_two: 'a string' }, { headers: { 'Cache-Control': 'max-age=300' } });
    case 'defer':
      return defer({ data_one: [], data_two: 'a string' });
    case 'null':
      return null;
    case 'undefined':
      return undefined;
    case 'throwRedirect':
      throw redirect('/?type=plain');
    case 'returnRedirect':
      return redirect('/?type=plain');
    case 'throwRedirectToExternal':
      throw redirect('https://example.com');
    case 'returnRedirectToExternal':
      return redirect('https://example.com');
    default: {
      return {};
    }
  }
};

function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default withSentry(App);
