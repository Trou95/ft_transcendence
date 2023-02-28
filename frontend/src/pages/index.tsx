import { useEffect, useState } from 'react';
import axios from '@/lib/axios';

export default function Home() {
    const [user, setUser] = useState({
        name: undefined,
    });

    useEffect(() => {
        axios.get('/auth/user').then(res => setUser(res.data));
    }, []);
    return (
        <>
            <h1 className="text-9xl text-red-700">{user.name}</h1>
        </>
    );
}
