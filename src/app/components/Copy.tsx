import React from "react";
import {useSelector} from "react-redux";
import GrpCurlCommand, {bodyParams} from "../../models/GrpCurlCommand";
import Button, {ButtonSize, ButtonType} from "./Photon/Button/Button";

export default function Copy() {

    const command: GrpCurlCommand = useSelector((state) => {
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
            <textarea className="curl-command form-control" value={example} readOnly={true}></textarea>
            <Button disabled={false} onClick={onClick} type={ButtonType.DEFAULT} size={ButtonSize.SMALL}>
                Copy gRPCurl command
            </Button>
        </div>
    )
}