import React from 'react';

export enum ButtonType {
  DEFAULT,
  PRIMARY,
  POSITIVE,
  NEGATIVE,
  WARNING,
}

export enum ButtonSize {
  NORMAL,
  SMALL,
  LARGE,
}

const sizeToString = (size: ButtonSize) => {
  switch (size) {
    case ButtonSize.LARGE: {
      return 'btn-large';
    }
    case ButtonSize.SMALL: {
      return 'btn-mini';
    }
  }
  return '';
};

const typeToString = (type: ButtonType) => {
  switch (type) {
    case ButtonType.PRIMARY: {
      return 'btn-primary';
    }
    case ButtonType.POSITIVE: {
      return 'btn-positive';
    }
    case ButtonType.NEGATIVE: {
      return 'btn-negative';
    }
    case ButtonType.WARNING: {
      return 'btn-warning';
    }
  }
  return 'btn-default';
};

export type ButtonProps = {
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
  type?: ButtonType;
  size?: ButtonSize;
  classes?: string[];
  children?: React.ReactNode;
};

export default function Button(buttonProps: ButtonProps): JSX.Element {
  const {
    onClick = () => null,
    disabled = false,
    type = ButtonType.DEFAULT,
    size = ButtonSize.NORMAL,
    classes: givenClassNames = [],
    children,
  } = buttonProps;

  const generatedName = `btn-${Math.random().toString(36).substr(2, 9)}`;
  const typeClass = typeToString(type);
  const sizeClass = sizeToString(size);
  const disabledClass = disabled ? 'disabled' : 'enabled';
  const classes = ['btn', generatedName, typeClass, sizeClass, disabledClass, givenClassNames]
    .filter((clazz) => !!clazz?.length)
    .join(' ');

  return (
    <button className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
