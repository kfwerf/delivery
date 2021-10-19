import React from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-beautify';
import 'ace-builds/src-noconflict/ext-language_tools';
import { updateBody } from '../../actions/request';
import { addToast } from '../../actions/toast';
import { useAppDispatch, useIntrospectionState, useRequestState } from '../../utils/hooks';

const normalizeBody = (body = '') => {
  try {
    return JSON.stringify(JSON.parse(body), null, 4);
  } catch (e) {
    console.error('failed to decode the body', body);
    return '';
  }
};

const getValue = (body: string, example: string) => {
  const hasBody = body && body?.length;
  return hasBody ? normalizeBody(body) : normalizeBody(example);
};

export default function Body(): JSX.Element {
  const generatedName = `body-${Math.random().toString(36).substr(2, 9)}`;
  const generatedNameInput = `${generatedName}-textarea`;
  const classes = ['body', generatedName].join(' ');

  const isDisabled: boolean = useIntrospectionState((state) => state?.isLoading);
  const body: string = useRequestState((state) => state?.body);
  const example: string = useRequestState((state) => state?.example);
  const dispatch = useAppDispatch();
  const onChange = (body: string) => {
    try {
      dispatch(updateBody(body));
    } catch (error) {
      dispatch(addToast('Body could not be parsed', error, 'error'));
    }
  };

  return (
    <div className={classes} id={generatedNameInput}>
      <div className="form-group">
        <label htmlFor={generatedNameInput}>Your body</label>
        <AceEditor
          mode="json"
          theme="github"
          placeholder="Your body"
          onChange={onChange}
          value={getValue(body, example)}
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
  );
}
