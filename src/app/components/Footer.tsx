import Progress from "./Progress";
import Send from "./Request/Send";
import Reset from "./Request/Reset";
import React from "react";
import {useSelector} from "react-redux";
import Copy from "./Copy";

export default function Footer() {
    const progressLoading: number = useSelector((state) => {
        // @ts-ignore
        return state?.request?.progressLoading;
    });
    return (
        <footer className="toolbar toolbar-footer">
            <div className="toolbar-actions request-footer">
                <div className="footer-left">
                    <div className="send"> <Send /> </div>
                    <div className="reset"> <Reset /> </div>
                    <div className="copy"> <Copy /> </div>
                </div>
                <div className="footer-right">
                    <Progress amount={progressLoading}></Progress>
                </div>
            </div>
        </footer>
    );
}