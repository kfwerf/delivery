import React from "react";

export type ButtonGroupProps = {
    children?: React.ReactNode;
};

export default function ButtonGroup(buttonGroupProps: ButtonGroupProps) {
    const { children } = buttonGroupProps;
    return (
        <div className="btn-group">
            { children }
        </div>
    )

}