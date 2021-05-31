import Input from "./Input/Input";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import Option from "./input/Option";
import {updateUrl} from "../actions/request";
import {introspection} from "../actions/introspection";

export default function UrlInput() {
    const selectizeConfig = {
        create: true,
        createFilter: (url: string) => url.length > 3,
        sortField: 'text',
        placeholder: 'Input gRPC server, e.g. localhost:5990',
    };

    const isDisabled: boolean = useSelector((state) => {
        // @ts-ignore
        return state?.introspection?.isLoading;
    });

    const dispatch = useDispatch();
    const onChange = (url: string) => {
        dispatch(introspection(url));
        dispatch(updateUrl(url));
    };

    const options = [
        new Option('localhost:5990', 'localhost:5990', 'localhost:5990')
    ];

    return (
        <div>
            <Input
                label = "Your URL"
                selectizeConfig = {selectizeConfig}
                onChange = {onChange}
                options ={options}
                optionGroups={[]}
                disabled={isDisabled}
            />
        </div>
    )
}
