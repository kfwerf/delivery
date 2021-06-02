import React from "react";

export type ToolbarHeaderProps = {
    children?: React.ReactNode;
};

export default function ToolbarHeader(toolbarHeaderProps: ToolbarHeaderProps) {
    const { children } = toolbarHeaderProps;
    return (
        <header className="toolbar toolbar-header">
            { children }
        </header>
    )

}