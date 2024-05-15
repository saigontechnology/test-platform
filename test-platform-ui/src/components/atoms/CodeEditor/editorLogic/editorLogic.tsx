'use client';

import { Editor, useMonaco } from '@monaco-editor/react';
import { Box } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { CODE_SNIPPETS } from '../../../../constants/code-question-constants';
import LanguageSelector from './languageSelector';
import OutPut from './output';

interface IEditorCode {
  language?: string;
  value: string;
  onMount?: (editor: any) => void;
  height?: number;
  width?: number;
}

export const EditorCode = ({
  language = 'html',
  value,
  onMount,
  height = 300,
  width = 400,
}: IEditorCode) => {
  const monaco = useMonaco();

  useEffect(() => {
    // do conditional chaining
    // monaco?.languages.typescript.javascriptDefaults.setEagerModelSync(true);
    // or make sure that it exists by other ways
    if (monaco) {
      console.log('here is the monaco instance:', monaco);
    }
  }, [monaco]);

  return (
    <Box
      className="editor-wrapper mt-4"
      sx={{
        width: width + 'px',
        height: height + 'px',
      }}
    >
      <Editor
        height="100%"
        width="inherit"
        language={language}
        value={value}
        theme="vs-dark"
        onMount={onMount}
        options={{
          fontSize: 14,
          minimap: {
            enabled: false,
          },
          contextmenu: false,
        }}
      />
    </Box>
  );
};

export default function EditorLogic() {
  const editorRef = useRef();
  const [value, setValue] = useState(CODE_SNIPPETS('javascript'));
  const [language, setLanguage] = useState('javascript');

  const onMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language: any) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS(language) || '// some comment');
  };

  return (
    <Box className="relative flex w-full flex-row gap-1">
      <Box className="m-4">
        <LanguageSelector language={language} onSelect={onSelect} />
        <EditorCode language={language} value={value || ''} onMount={onMount} />
      </Box>
      <OutPut editorRef={editorRef} language={language} />
    </Box>
  );
}
