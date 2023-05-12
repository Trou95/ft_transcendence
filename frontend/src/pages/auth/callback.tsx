import {useRouter} from "next/router";
import {useEffect} from "react";
import axios from "axios";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

export default function Callback()
{
    const {query} = useRouter();

    const getLoginData = async () => {
        const token = await axios.get("http://localhost:3000/auth/callback", { params: { code: query.code } });
        // @ts-ignore
        localStorage.setItem("access-token",token.data);
    };

    useEffect(() => {
        if(!query?.code)
            return;

        getLoginData().then(() => {
            window.location.href = "/auth/account";}
        ).catch((error) => {console.log(error)});

        console.log(query.code);

    },[query])

    return (
        <>
        </>
    )
}