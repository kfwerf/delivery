import React from "react";
import {useSelector} from "react-redux";
import GrpCurlCommand, {bodyParams} from "../../models/GrpCurlCommand";
import Button from "./Button";

export default function GrpcurlRequest() {

    const command: GrpCurlCommand = useSelector((state) => {
        console.log(state)
        // @ts-ignore
        return state?.command?.command;
    });

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

    const example = command?.setParams(bodyParams(body, url, method))?.toString();

    const onClick = () => {
        const copyText: HTMLTextAreaElement = document.querySelector('.curl-command');
        copyText.select();
        document.execCommand('copy');
    }

    return (
        <div className="curl-debug">
            <textarea className="curl-command" type="text" value={example} readOnly={true}></textarea>
            <Button label={"Copy command"} disabled={false} onClick={onClick}/>
        </div>
    )
}