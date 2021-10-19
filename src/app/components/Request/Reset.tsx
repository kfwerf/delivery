import React from 'react';
import Button, { ButtonSize, ButtonType } from '../Photon/Button/Button';
import { useDispatch } from 'react-redux';
import { updateBody } from '../../actions/request';
import persistenceRegistry from '../../persistency/PersistenceRegistry';
import { useAppSelector } from '../../utils/hooks';

export default function Request(): JSX.Element {
  const isDisabled: boolean = useAppSelector((state) => {
    return state?.request?.isLoading;
  });

  const dispatch = useDispatch();
  const onClick = () => {
    persistenceRegistry.clearBodies();
    dispatch(updateBody(''));
  };

  return (
    <Button onClick={onClick} disabled={isDisabled} type={ButtonType.DEFAULT} size={ButtonSize.NORMAL}>
      Reset body
    </Button>
  );
}
