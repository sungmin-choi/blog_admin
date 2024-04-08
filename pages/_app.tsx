import '@/styles/globals.css';

import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import Script from 'next/script';

import { Amplify } from 'aws-amplify';
import { NextPageWithLayout } from './page';

Amplify.configure(
  {
    Auth: {
      Cognito: {
        userPoolClientId: '47rv6m0krpj8s0ns51aire8i61',
        userPoolId: 'ap-northeast-2_K8rKOKOQx',
        loginWith: {
          // Optional

          oauth: {
            domain: 'admin.auth.ap-northeast-2.amazoncognito.com',
            scopes: [
              'openid email phone profile aws.cognito.signin.user.admin ',
            ],
            redirectSignIn: [
              'http://localhost:3000/',
              'https://admin.qwerblog.com/',
            ],
            redirectSignOut: [
              'http://localhost:3000/',
              'https://admin.qwerblog.com/',
            ],
            responseType: 'code',
          },
        },
      },
    },
  },
  { ssr: true }
);

interface AppPropsWithLayout extends AppProps {
  Component: NextPageWithLayout;
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <>
      {/* <!-- Google tag (gtag.js) --> */}

      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
      />

      <Script id="google-analytics" strategy="afterInteractive">
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}', {
        page_path: window.location.pathname,
        });
    `}
      </Script>

      <ThemeProvider enableSystem={true} attribute="class">
        {getLayout(<Component {...pageProps} />)}
      </ThemeProvider>
    </>
  );
}

export default MyApp;
