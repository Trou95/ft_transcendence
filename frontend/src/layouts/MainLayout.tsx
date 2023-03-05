import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Script from 'next/script';

interface Props {
    children: React.ReactNode;
}

export default function MainLayout({ children }: Props) {
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const user: any = window.localStorage.getItem('user');
            if (!user) router.push('/auth/login');
        }
    }, []);

    return <>{children}</>;
}
