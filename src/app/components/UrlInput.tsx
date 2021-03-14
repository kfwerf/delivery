import Input from "./Input/Input";
import React from "react";
import {useDispatch} from "react-redux";
import Option from "./input/Option";
import {updateUrl} from "../actions/request";
import {introspection} from "../actions/introspection";

export default function UrlInput() {
    const selectizeConfig = {
        create: true,
        createFilter: (url: string) => url.length > 3,
        sortField: 'text',
        placeholder: 'localhost:443',
    };

    const dispatch = useDispatch();
    const onChange = (url: string) => {
        dispatch(introspection(url));
        dispatch(updateUrl(url));
    };

    const options = [
        new Option('localhost:9999', 'localhost:9999', 'localhost:9999')
    ];

    return (
        <div>
            <Input
                label = "Your URL"
                selectizeConfig = {selectizeConfig}
                onChange = {onChange}
                options ={options}
                optionGroups={[]}
                disabled={false}
            />
        </div>
    )
}
