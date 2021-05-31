import React from "react";
import AceEditor from "react-ace";
import {useDispatch, useSelector} from "react-redux";
import GrpcTypeRegistry from "../../../registry/registry";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-beautify";
import "ace-builds/src-noconflict/ext-language_tools";
import {updateBody} from "../../actions/request";
import GrpCurlResponse from "../../../models/GrpCurlResponse";

export default function Result() {
    const generatedName = `result-${Math.random().toString(36).substr(2, 9)}`;
    const generatedNameInput = `${generatedName}-textarea`;

    const response: GrpCurlResponse = useSelector((state) => {
        // @ts-ignore
        const response: GrpCurlResponse = state?.request?.response;
        return response;
    });

    let value = '';
    if (response.hasError()) {
        value = response.getError();
    } else {
        try {
            value = JSON.stringify(JSON.parse(response.getData()), null, 4);
        } catch(ignore) {
            value = response.getData();
        }
    }

    console.log(response);

    return (
        <div className={generatedName} id={generatedNameInput}>
            <AceEditor
                mode="json"
                theme="github"
                placeholder="Response"
                wrapEnabled={true}
                readOnly={true}
                value={value}
                width="100%"
                height="622px"
                highlightActiveLine={false}
                name={generatedNameInput}
                editorProps={{ $blockScrolling: true }}
                setOptions={{
                    enableBasicAutocompletion: false,
                    enableLiveAutocompletion: false,
                }}
            />
        </div>
    )
}