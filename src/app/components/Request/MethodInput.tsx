import Input from '../Photon/Input/Input';
import React from 'react';
import GrpcTypeRegistry from '../../../registry/registry';
import OptionGroup from '../Photon/Input/OptionGroup';
import Option from '../Photon/Input/Option';
import { updateMethod } from '../../actions/request';
import { useAppDispatch, useAppSelector, useIntrospectionState, useRequestState } from '../../utils/hooks';

export default function MethodInput(): JSX.Element {
  const selectizeConfig = {
    create: true,
    createFilter: (method: string) => method.length > 3,
    sortField: 'text',
    placeholder: 'com.delivery.v1.messages.MessageService/getMessages',
  };

  const registry: GrpcTypeRegistry = useIntrospectionState((state) => state?.typeRegistry || new GrpcTypeRegistry());

  const isDisabled: boolean = useAppSelector(
    (state) => state?.request?.url?.length < 4 || state?.introspection?.isLoading,
  );

  const value: string = useRequestState((state) => state?.method);

  const services = registry.listServices();

  const options = services
    .map((service) => service.getRpcList().map((rpc) => new Option(service.getPath(), rpc.getPath(), rpc.getPath())))
    .reduce((a, b) => a.concat(b), [] as Option[]);

  const optionGroups = services
    .filter((service) => service.getRpcList().length)
    .map((service) => new OptionGroup(service.getName(), service.getPath()));

  const dispatch = useAppDispatch();
  const onBlur = (path: string) => {
    dispatch(updateMethod(path));
  };

  return (
    <div>
      <Input
        label="Your method"
        selectizeConfig={selectizeConfig}
        onBlur={onBlur}
        value={value}
        options={options}
        optionGroups={optionGroups}
        disabled={isDisabled}
        clear={true}
      />
    </div>
  );
}
