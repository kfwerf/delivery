import React from 'react';
import GrpCurlCommand, { bodyParams } from '../../models/GrpCurlCommand';
import Button, { ButtonSize, ButtonType } from './Photon/Button/Button';
import { useAppSelector } from '../utils/hooks';

export default function Copy(): JSX.Element {
  const command: GrpCurlCommand = useAppSelector((state) => {
    return state?.command?.command;
  });

  const url: string = useAppSelector((state) => {
    return state?.request?.url;
  });

  const method: string = useAppSelector((state) => {
    return state?.request?.method;
  });

  const body: string = useAppSelector((state) => {
    return state?.request?.body;
  });

  const example = command?.setParams(bodyParams(body, url, method))?.toString();

  const onClick = () => {
    const copyText: HTMLTextAreaElement = document.querySelector('.curl-command');
    copyText.select();
    document.execCommand('copy');
  };

  return (
    <div className="curl-debug">
      <textarea className="curl-command form-control" value={example} readOnly={true}></textarea>
      <Button disabled={false} onClick={onClick} type={ButtonType.DEFAULT} size={ButtonSize.SMALL}>
        Copy gRPCurl command
      </Button>
    </div>
  );
}
