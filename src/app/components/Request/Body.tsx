import React from "react";
import AceEditor from "react-ace";
import GrpcTypeRegistry from "../../../registry/registry";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-beautify";
import "ace-builds/src-noconflict/ext-language_tools";
import {updateBody} from "../../actions/request";
import {addToast} from "../../actions/toast";
import {useAppDispatch, useAppSelector} from "../../utils/hooks";
import persistenceRegistry, {PersistenceRegistry} from "../../persistency/PersistenceRegistry";

export default function Body() {
    const generatedName = `body-${Math.random().toString(36).substr(2, 9)}`;
    const generatedNameInput = `${generatedName}-textarea`;
    const classes = ['body', generatedName].join(' ');

    const isDisabled: boolean = useAppSelector((state) => {
        return state?.introspection?.isLoading;
    });

    const url: string = useAppSelector((state) => {
        return state?.request?.url;
    });

    const method: string = useAppSelector((state) => {
        return state?.request?.method;
    });

    const typeRegistry: GrpcTypeRegistry = useAppSelector((state) => {
        return state?.introspection?.typeRegistry;
    });

    const rpc = typeRegistry?.getRpc(method);
    const requestMethod = rpc?.getRequest();
    const message = typeRegistry?.getMessage(requestMethod);
    const example = message?.getExample(typeRegistry) || {};
    const bodyEntry = persistenceRegistry.getBody(url, method, example);

    const dispatch = useAppDispatch();
    const onChange = (body: string) => {
        try {
            persistenceRegistry.setBody(PersistenceRegistry.newBodyEntry(url, method, example, JSON.parse(body)));
            dispatch(updateBody(JSON.parse(JSON.stringify(body))));
        } catch(error) {
            dispatch(addToast('Body could not be parsed', error, 'error'));
        }
    };

    const value = JSON.stringify(JSON.parse(bodyEntry.body), null, 4);

    return (
        <div className={classes} id={generatedNameInput}>
            <div className="form-group">
                <label htmlFor={generatedNameInput}>Your body</label>
                <AceEditor
                    mode="json"
                    theme="github"
                    placeholder="Your body"
                    onChange={onChange}
                    value={value}
                    name={generatedNameInput}
                    editorProps={{ $blockScrolling: true }}
                    setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                    }}
                    height="457px"
                    width="100%"
                    readOnly={isDisabled}
                />
            </div>
        </div>
    )
}