import React from "react";
import Button, {ButtonSize, ButtonType} from "../Photon/Button/Button";
import {useDispatch, useSelector} from "react-redux";
import {updateBody, updateMethod, updateUrl} from "../../actions/request";
import persistenceRegistry from "../../persistency/PersistenceRegistry";

export default function Request() {
    const isDisabled: boolean = useSelector((state) => {
        // @ts-ignore
        return state?.request?.isLoading;
    });

    const dispatch = useDispatch();
    const onClick = () => {
        persistenceRegistry.clearBodies();
        dispatch(updateBody(''));
    };

    return (
        <Button onClick={onClick} disabled={isDisabled} type={ButtonType.DEFAULT} size={ButtonSize.NORMAL}>
            Reset body
        </Button>
    );
}