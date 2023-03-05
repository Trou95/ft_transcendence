import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import React, { ReactElement, ReactNode } from 'react';
import { NextPage } from 'next';
import MainLayout from '@/layouts/MainLayout';
import Script from 'next/script';
import Head from 'next/head';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
    const getLayout = Component.getLayout ?? (page => page);

    return (
        <>
            <Script
                src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.3/flowbite.min.js"
                strategy="beforeInteractive"
            />
            <MainLayout>{getLayout(<Component {...pageProps} />)}</MainLayout>
        </>
    );
}
