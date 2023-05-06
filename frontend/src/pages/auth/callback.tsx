import {useRouter} from "next/router";
import {useEffect} from "react";

export default function Callback()
{
    const {query} = useRouter();

    useEffect(() => {
        if(!query?.code)
            return;

        console.log(query.code);

    },[query])

    return (
        <>
        </>
    )
}