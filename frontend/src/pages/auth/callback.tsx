import {useEffect} from "react";
import {useRouter} from "next/router";
import axios from "axios";

export default function Callback() {
    const {query} = useRouter();

    useEffect(() =>  {
        if(!query?.code)
            return
        async function test() {
            await axios.post("http://localhost:3000/auth/login", {code: query?.code})
                .then((res) => localStorage.setItem('user', JSON.stringify(res.data)))
                .catch(err => console.log(err));
        }

        test();

    },[query.code])

    return (
        <>
        </>
    )
}