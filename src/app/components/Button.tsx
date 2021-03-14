import React from "react";

export default function Button(item : { label: string, onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void, disabled: boolean }) {
    const generatedName = `btn-${Math.random().toString(36).substr(2, 9)}`;
    const classes = `${generatedName} btn btn-default`;

    const {
        label,
        onClick,
        disabled,
    } = item;

    return (<button className={classes} onClick={onClick}>{label}</button>)
}