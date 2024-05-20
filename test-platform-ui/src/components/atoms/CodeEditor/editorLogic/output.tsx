import { showNotification } from '@/libs/toast';
import { Box, Button } from '@mui/material';
import { MutableRefObject, useState } from 'react';
import { executiveCode } from './api';

interface IOutPut {
  editorRef: MutableRefObject<any>;
  language: string;
}

export default function OutPut({ editorRef, language }: IOutPut) {
  const [output, setOutput] = useState<any>(null);

  const runCode = async () => {
    setOutput('Compiling ....');
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
    try {
      const { run: result } = await executiveCode(language, sourceCode);
      setOutput(result.output);
    } catch (error: any) {
      showNotification(`An error occurred. ${error.message}`, 'error');
    }
  };

  return (
    <Box className="relative m-4 basis-1/2">
      <Button variant="outlined" onClick={runCode} className="mb-4">
        Run code
      </Button>
      <Box
        className="absolute"
        height="-webkit-fill-available"
        width="100%"
        p={2}
        border={'1px solid'}
        borderRadius={4}
        borderColor={'#333'}
      >
        {output ? output : '# Click "Run Code" to see the output here'}
      </Box>
    </Box>
  );
}
