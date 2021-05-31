import React, {useEffect} from 'react';
import jQuery from 'jquery';
import 'selectize';
import Option from "./Option";
import OptionGroup from "./OptionGroup";

export type InputProps = {
    label?: string,
    selectizeConfig?: {},
    onChange?: (value: string) => void,
    onBlur?: (value: string) => void,
    options?: Option[],
    optionGroups?: OptionGroup[],
    disabled?: boolean,
    loading?: boolean,
}

export default function Input(item : InputProps) {
    const {
        label = '',
        selectizeConfig = {},
        onChange = () => {},
        onBlur = () => {},
        optionGroups = [],
        options = [],
        disabled = false,
        loading = false,
    } = item;

    const generatedName = `selectize-${Math.random().toString(36).substr(2, 9)}`;
    const generatedNameInput = `${generatedName}-input`;
    const loadingClass = loading ? 'loading' : '';
    const classes = ['form-group', loadingClass].join(' ');

    useEffect(() => {
        // FIXME: deregister this to avoid selectizen over and over again
        const selectize = (jQuery(`#${generatedNameInput}`) as any).selectize(selectizeConfig)[0].selectize;
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

        if(disabled) {
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