import React, {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import UrlInput from "./components/UrlInput";
import MethodInput from "./components/MethodInput";
import Body from "./components/Body";
import Send from "./components/Send";

import '../index.css';
import '../css/selectize.css';
import '../css/selectize.default.css';
import '../css/photon.css';
import Result from "./components/Result";

export default function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        //dispatch(fetchTransport());
    }, [dispatch]);

    const onChange = (newValue: any) => {
        console.log("change", newValue);
    }

    //const list = useSelector((state) => state?.transport?.filtered || []);
    return (
        <div className="window">
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
                <div className="toolbar-actions">
                    <div className="send"> <Send /> </div>
                </div>
            </footer>
        </div>
    );
}