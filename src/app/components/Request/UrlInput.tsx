import Input from "../Photon/Input/Input";
import React from "react";
import Option from "../Photon/Input/Option";
import {updateBody, updateMethod, updateUrl} from "../../actions/request";
import {introspection} from "../../actions/introspection";
import {useAppDispatch, useAppSelector} from "../../utils/hooks";
import persistenceRegistry, {PersistenceRegistry} from "../../persistency/PersistenceRegistry";

export default function UrlInput() {
    const selectizeConfig = {
        create: true,
        createFilter: (url: string) => url.length > 3,
        sortField: 'text',
        placeholder: 'Input gRPC server, e.g. localhost:5990',
    };

    const isDisabled: boolean = useAppSelector((state) => {
        return state?.introspection?.isLoading;
    });

    const isLoading: boolean = useAppSelector((state) => {
        return state?.introspection?.isLoading;
    });

    const urls: string[] = useAppSelector((state) => {
        console.log(state);
        return state?.request?.urls;
    });



    const dispatch = useAppDispatch();
    const onBlur = (url: string) => {
        dispatch(updateUrl(url));
    };

    const options = urls.map(url => new Option(url, url, url));

    return (
        <div>
            <Input
                label = "Your URL"
                selectizeConfig = {selectizeConfig}
                onBlur = {onBlur}
                options ={options}
                optionGroups={[]}
                disabled={isDisabled}
                loading={isLoading}
            />
        </div>
    )
}
