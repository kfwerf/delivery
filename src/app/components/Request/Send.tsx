import React from 'react';
import Button, { ButtonSize, ButtonType } from '../Photon/Button/Button';
import { useDispatch } from 'react-redux';
import { sendRequest } from '../../actions/request';
import { useAppSelector } from '../../utils/hooks';
import { validateJSON } from '../../utils/validators';
import { addToast } from '../../actions/toast';

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

  const example: string = useAppSelector((state) => {
    return state?.request?.example;
  });

  const isDisabled: boolean = useAppSelector((state) => {
    return state?.request?.isLoading || state?.introspection?.isLoading;
  });

  const getValue = (body: string, example: string) => {
    const hasBody = body && body?.length;
    return hasBody ? body : example;
  };

  const dispatch = useDispatch();
  const onClick = () => {
    const val = getValue(body, example); // FIXME: Might be best to make body == example
    const isInvalidBody = !validateJSON(val);
    if (isInvalidBody) {
      console.warn('Not sending out send, body is invalid, toasting instead');
      dispatch(addToast('Invalid body', 'The current body is not valid JSON', 'error'));
      return;
    }
    dispatch(sendRequest(url, method, val));
  };

  return (
    <Button onClick={onClick} disabled={isDisabled} type={ButtonType.PRIMARY} size={ButtonSize.SMALL}>
      Send
    </Button>
  );
}
