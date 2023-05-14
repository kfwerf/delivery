import React from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-beautify';
import 'ace-builds/src-noconflict/ext-language_tools';
import GrpCurlResponse from '../../../models/GrpCurlResponse';
import { useAppSelector } from '../../utils/hooks';

export default function Result(): JSX.Element {
  const generatedName = `result-${Math.random().toString(36).substr(2, 9)}`;
  const generatedNameInput = `${generatedName}-textarea`;

  const response: GrpCurlResponse = useAppSelector((state) => {
    return state?.request?.response;
  });

  let value = '';
  if (response.hasError()) {
    value = response.getError();
  } else {
    try {
      value = JSON.stringify(JSON.parse(response.getData()), null, 4);
    } catch (ignore) {
      value = response.getData();
    }
  }

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
        height="calc(100vh - 35px)"
        highlightActiveLine={false}
        name={generatedNameInput}
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
        }}
      />
    </div>
  );
}
