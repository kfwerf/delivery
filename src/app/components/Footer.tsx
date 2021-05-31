import Progress from "./Progress";
import Send from "./Send";
import Reset from "./Reset";
import React from "react";
import {useSelector} from "react-redux";

export default function Footer() {
    const progressLoading: number = useSelector((state) => {
        console.log(progressLoading);
        // @ts-ignore
        return state?.request?.progressLoading;
    });
    return (
        <footer className="toolbar toolbar-footer">
            <div className="toolbar-actions request-footer">
                <div className="footer-left">
                    <div className="send"> <Send /> </div>
                    <div className="reset"> <Reset /> </div>
                    <Progress amount={progressLoading}></Progress>
                </div>
                <div className="footer-right">

                </div>
            </div>
        </footer>
    );
}