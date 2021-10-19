import React from 'react';
import Button, { ButtonSize, ButtonType } from '../Photon/Button/Button';
import { useDispatch } from 'react-redux';
import { sendRequest } from '../../actions/request';
import { useAppSelector } from '../../utils/hooks';

export default function Send(): JSX.Element {
  const url: string = useAppSelector((state) => {
    return state?.request?.url;
  });

  const method: string = useAppSelector((state) => {
    return state?.request?.method;
  });

  const body: string = useAppSelector((state) => {
    return state?.request?.body;
  });

  const isDisabled: boolean = useAppSelector((state) => {
    return state?.request?.isLoading || state?.introspection?.isLoading;
  });

  const dispatch = useDispatch();
  const onClick = () => {
    dispatch(sendRequest(url, method, body));
  };

  return (
    <Button onClick={onClick} disabled={isDisabled} type={ButtonType.PRIMARY} size={ButtonSize.SMALL}>
      Send
    </Button>
  );
}
