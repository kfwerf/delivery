import Input from "./Input/Input";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import GrpcTypeRegistry from "../../registry/registry";
import OptionGroup from "./Input/OptionGroup";
import Option from "./Input/Option";
import {updateMethod} from "../actions/request";

export default function MethodInput() {
    const selectizeConfig = {
        create: true,
        createFilter: (method: string) => method.length > 3,
        sortField: 'text',
        placeholder: 'com.delivery.v1.messages.MessageService/getMessages',
    };

    const registry: GrpcTypeRegistry = useSelector((state) => {
        // @ts-ignore
        return state?.introspection?.typeRegistry || new GrpcTypeRegistry();
    });

    const isDisabled: boolean = useSelector((state) => {
        // @ts-ignore
        return state?.request?.url?.length < 4 || state?.introspection?.isLoading;
    });

    const services = registry.listServices();

    const options = services
        .map((service) =>
            service
                .getRpcList()
                .map((rpc) => new Option(service.getPath(), rpc.getPath(), rpc.getPath())))
        .reduce((a, b) => a.concat(b), [] as Option[])

    const optionGroups = services
        .filter((service) => service.getRpcList().length)
        .map((service) => new OptionGroup(service.getName(), service.getPath()));

    const dispatch = useDispatch();
    const onChange = (path: string) => {
        dispatch(updateMethod(path));
    };

    return (
        <div>
            <Input
                label = "Your method"
                selectizeConfig = {selectizeConfig}
                onChange = {onChange}
                options ={options}
                optionGroups ={optionGroups}
                disabled={isDisabled}
    />
    </div>
)
}
