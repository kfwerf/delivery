import React from "react";
import Button, {ButtonSize, ButtonType} from "../Photon/Button/Button";
import {useDispatch, useSelector} from "react-redux";
import {updateBody, updateMethod, updateUrl} from "../../actions/request";

export default function Request() {
    const isDisabled: boolean = useSelector((state) => {
        // @ts-ignore
        return state?.request?.isLoading;
    });

    const dispatch = useDispatch();
    const onClick = () => {
        dispatch(updateUrl(''));
        dispatch(updateMethod(''));
        dispatch(updateBody(''));
    };

    return (
        <Button onClick={onClick} disabled={isDisabled} type={ButtonType.DEFAULT} size={ButtonSize.NORMAL}>
            Reset
        </Button>
    );
}