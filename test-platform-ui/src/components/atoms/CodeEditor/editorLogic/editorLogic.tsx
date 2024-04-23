import { Editor } from '@monaco-editor/react';
import { Box } from '@mui/material';
import { useRef, useState } from 'react';
import { CODE_SNIPPETS } from '../../../../constants/code-question-constants';
import LanguageSelector from './languageSelector';
import OutPut from './output';

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
        <Editor
          height="450px"
          width="450px"
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
      <OutPut editorRef={editorRef} language={language} />
    </Box>
  );
}
