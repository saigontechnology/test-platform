import axios from 'axios';

interface ICompilerOutput {
  language: string;
  version: string;
  run: {
    stdout: string;
    stderr: string;
    code: 0;
    signal: any;
    output: string;
  };
}

const API = axios.create({
  baseURL: 'https://emkc.org/api/v2/piston',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

function LanguageVersion(language: string) {
  return {
    javascript: '18.15.0',
    typescript: '5.0.3',
    python: '3.10.0',
  }[language];
}

export const executiveCode = async (language: string, sourceCode: string) => {
  const response = await API.post('/execute', {
    language: language,
    version: LanguageVersion(language),
    files: [
      {
        content: sourceCode,
      },
    ],
  });
  return response.data as ICompilerOutput;
};
