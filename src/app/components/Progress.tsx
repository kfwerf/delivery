import React from "react";

type ProgressProps = {
    amount?: number;
}

export default function Progress(props: ProgressProps) {
    const { amount } = props;
    const value = Math.max(0, Math.min(100, amount));
    const classes = value > 0 ? 'loading' : '';
    return (<progress max="100" value={value} className={classes}>value %</progress>);
}