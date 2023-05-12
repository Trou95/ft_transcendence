import {useRouter} from "next/router";
import {useEffect} from "react";
import axios from "axios";
import {Simulate} from "react-dom/test-utils";
import {headers} from "next/headers";

export default function Callback()
{
    const {query} = useRouter();


    const getLoginData = async () => {

        const access_token: any = localStorage.getItem("access-token");

        if(!access_token)
            return;

        console.log(access_token);

        const token = await axios.get("http://localhost:3000/auth/my-account",
            {headers: {'Authorization': `Bearer ${access_token}`}});
        // @ts-ignore
        console.log(token.data);
    };

    useEffect(() => {
        getLoginData();

    },[]);

    return (
        <>

        </>
    )
}