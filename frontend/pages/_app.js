import React, { useEffect } from 'react';
import Router from 'next/router';
import NProgress from 'nprogress';
import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Configure NProgress
NProgress.configure({ showSpinner: false });

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Start NProgress when route changes start
    const handleStart = () => {
      NProgress.start();
    };

    // Stop NProgress when route changes complete
    const handleStop = () => {
      NProgress.done();
    };

    // Handle route change events
    Router.events.on('routeChangeStart', handleStart);
    Router.events.on('routeChangeComplete', handleStop);
    Router.events.on('routeChangeError', handleStop);

    // Cleanup function
    return () => {
      Router.events.off('routeChangeStart', handleStart);
      Router.events.off('routeChangeComplete', handleStop);
      Router.events.off('routeChangeError', handleStop);
    };
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
