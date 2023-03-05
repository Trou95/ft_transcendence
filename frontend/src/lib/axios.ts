import Axios from 'axios';

let access_token = null;

if (typeof window !== 'undefined') {
    const user: any = window.localStorage.getItem('user');
    access_token = user?.access_token;
}

const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URI,
    headers: {
        Authorization: `Bearer ${access_token}`,
    },
});

export default axios;
