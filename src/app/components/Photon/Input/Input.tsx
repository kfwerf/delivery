import React, { useEffect } from 'react';
import jQuery from 'jquery';
import 'selectize';
import Option from './Option';
import OptionGroup from './OptionGroup';

export type InputProps = {
  label?: string;
  selectizeConfig?: Record<string, unknown>;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  value?: string;
  options?: Option[];
  optionGroups?: OptionGroup[];
  disabled?: boolean;
  loading?: boolean;
  clear?: boolean;
};

export default function Input(item: InputProps): JSX.Element {
  const {
    label = '',
    selectizeConfig = {},
    onChange = () => null,
    onBlur = () => null,
    value = '',
    optionGroups = [],
    options = [],
    disabled = false,
    loading = false,
    clear = false,
  } = item;

  const generatedName = `selectize-${Math.random().toString(36).substr(2, 9)}`;
  const generatedNameInput = `${generatedName}-input`;
  const loadingClass = loading ? 'loading' : '';
  const classes = ['form-group', loadingClass].join(' ');

  useEffect(() => {
    // FIXME: deregister this to avoid selectizen over and over again
    const selectize = (jQuery(`#${generatedNameInput}`) as any)?.selectize(selectizeConfig)[0].selectize; // eslint-disable-line @typescript-eslint/no-explicit-any

    if (clear) {
      selectize.clear(true);
      selectize.clearOptions(true);
    }

    selectize.on('change', (value: string) => {
      onChange(value);
    });

    selectize.on('blur', () => {
      onBlur(selectize.getValue());
    });

    options.forEach((option) => {
      selectize.addOption(option.toObject());
    });

    optionGroups.forEach((optionGroup) => {
      selectize.addOptionGroup(optionGroup.getValue(), optionGroup.toObject());
    });

    selectize.refreshOptions(false);

    if (value?.length > 0) {
      selectize.setValue(value, true);
    }

    if (disabled) {
      selectize.disable();
    } else {
      selectize.enable();
    }
  });

  return (
    <div className={generatedName}>
      <div className={classes}>
        <label htmlFor={generatedNameInput}>{label}</label>
        <select className="selectize" id={generatedNameInput} name={generatedNameInput} />
      </div>
    </div>
  );
}
