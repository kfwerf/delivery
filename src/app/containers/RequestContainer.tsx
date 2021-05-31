import React from "react";
import UrlInput from "../components/UrlInput";
import MethodInput from "../components/MethodInput";
import Body from "../components/Body";
import Result from "../components/Result";
import Send from "../components/Send";
import Copy from "../components/Copy";
import Reset from "../components/Reset";
import Header from "../components/Header";

export default function RequestContainer() {
    return (
        <section className="window">
            <Header />
            <div className="window-content">

                <div className="pane-group">
                    <div className="pane main-pane">
                        <div className="request">
                            <div className="selectors">
                                <UrlInput />
                                <MethodInput />
                            </div>
                            <Body />
                        </div>
                    </div>
                    <div className="pane">
                        <div className="response">
                            <Result />
                        </div>
                    </div>
                </div>
            </div>
            <footer className="toolbar toolbar-footer">
                <div className="toolbar-actions request-footer">
                    <div className="footer-left">
                        <div className="send"> <Send /> </div>
                        <div className="reset"> <Reset /> </div>
                    </div>
                    <div className="footer-right"></div>
                </div>
            </footer>
        </section>
    );
}