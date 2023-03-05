import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Callback() {
    const { query, push } = useRouter();

    useEffect(() => {
        if (!query?.code) return;
        async function test() {
            await axios
                .get('http://localhost:4242/auth/callback', {
                    params: {
                        code: query?.code,
                    },
                })
                .then(res => {
                    localStorage.setItem('user', JSON.stringify(res.data));
                    push('/');
                })
                .catch(err => console.log(err));
        }

        test();
    }, [query.code]);

    return <></>;
}
