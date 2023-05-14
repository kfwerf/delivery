import Input from '../Photon/Input/Input';
import React from 'react';

export default function ExecPath(): JSX.Element {
  const selectizeConfig = {
    create: true,
    createFilter: (method: string) => method.length > 3,
    sortField: 'text',
    placeholder: 'com.delivery.v1.messages.MessageService/getMessages',
  };
  return (
    <div>
      {/*     <Input
        label="Your method"
        selectizeConfig={selectizeConfig}
        onBlur={onBlur}
        value={value}
        options={options}
        optionGroups={optionGroups}
        disabled={isDisabled}
        clear={true}
      />*/}
    </div>
  );
}
