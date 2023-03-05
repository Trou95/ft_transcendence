import Layout from '@/layouts/MainLayout';
import React from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';

Index.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>;

export default function Index() {
    return (
        <>
            <h1>MErhaba</h1>
        </>
    );
}
