import React from "react";
import Button, {ButtonSize, ButtonType} from "../Photon/Button/Button";
import {useDispatch, useSelector} from "react-redux";
import {sendRequest} from "../../actions/request";

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

    const isDisabled: boolean = useSelector((state) => {
        // @ts-ignore
        return state?.request?.isLoading || state?.introspection?.isLoading;
    });

    const dispatch = useDispatch();
    const onClick = () => {
        dispatch(sendRequest(url, method, body));
    };

    return (
        <Button onClick={onClick} disabled={isDisabled} type={ButtonType.PRIMARY} size={ButtonSize.SMALL} >
            Send
        </Button>
    );
}