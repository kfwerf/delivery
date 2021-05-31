import React from "react";

type ProgressProps = {
    amount?: number;
}

export default function Progress(props: ProgressProps) {
    const { amount } = props;
    const value = Math.max(0, Math.min(100, amount));
    return (<progress max="100" value={value}>value %</progress>);
}