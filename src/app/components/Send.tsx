import React from "react";
import Button from "./Button";
import {useDispatch, useSelector} from "react-redux";
import {sendRequest} from "../actions/request";

export default function Send() {
    const url: string = useSelector((state) => {
        // @ts-ignore
        return state?.request?.url;
    });

    const method: string = useSelector((state) => {
        // @ts-ignore
        return state?.request?.method;
    });

    const body: string = useSelector((state) => {
        // @ts-ignore
        return state?.request?.body;
    });

    const dispatch = useDispatch();
    const onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        dispatch(sendRequest(url, method, body));
    };

    return (<Button label={"Send"} onClick={onClick} disabled={false} />)
}