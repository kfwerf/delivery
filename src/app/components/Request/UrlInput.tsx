import Input from "../Photon/Input/Input";
import React from "react";
import Option from "../Photon/Input/Option";
import {updateUrl} from "../../actions/request";
import {
    useAppDispatch,
    useIntrospectionState,
    useRequestState
} from "../../utils/hooks";

export default function UrlInput() {
    const selectizeConfig = {
        create: true,
        createFilter: (url: string) => url.length > 3,
        sortField: 'text',
        placeholder: 'Input gRPC server, e.g. localhost:5990',
    };

    const isDisabled: boolean = useIntrospectionState((state) => state?.isLoading);
    const isLoading: boolean = useIntrospectionState((state) => state?.isLoading);
    const urls: string[] = useRequestState((state) => state?.urls);

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
