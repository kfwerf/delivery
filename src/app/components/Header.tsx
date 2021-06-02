import Copy from "./Copy";
import React from "react";
import ButtonGroup from "./Photon/Button/ButtonGroup";
import Button from "./Photon/Button/Button";
import ToolbarHeader from "./Photon/Toolbar/ToolbarHeader";
import Icon, {IconName} from "./Photon/Icon";

export default function Header() {
    return (
        <ToolbarHeader>
            <div className="toolbar-actions">
                <div className="copy pull-right"> <Copy /> </div>
            </div>
        </ToolbarHeader>
    );
}