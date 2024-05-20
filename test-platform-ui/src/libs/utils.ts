'use client';

export const calc_image_size_base64 = (image: string) => {
  let y = 1;
  if (image.endsWith('==')) {
    y = 2;
  }
  const x_size = image.length * (3 / 4) - y;
  return Math.round(x_size / 1024 / 1024);
};

export const regexEmail = (email: string | null) => {
  if (!email) return false;
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

export const isStringHTML = (string: string) => {
  const regexForHTML = /<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>/;
  return regexForHTML.test(string);
};

export const convertBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

export const resize_base64 = async (
  base64: string,
  opts: { width: number } = { width: 450 },
) =>
  await new Promise((resolve) => {
    const MAX_WIDTH = opts.width;
    let img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ratio = MAX_WIDTH / img.width;

      canvas.width = MAX_WIDTH;
      canvas.height = img.height * ratio;
      const context = canvas.getContext('2d');
      context?.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL());
    };
  });

export const getClientSideCookie = (name: string): string | undefined => {
  const cookieValue = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];

  return cookieValue;
};

export const handleMappingImportData = async (
  sourceType: string,
  importData: any,
  _category: string,
) => {
  if (sourceType === 'X') {
    const _questions = await MappingDataX(
      importData,
      `temporary title ${importData.test_name} - ${importData.level}`,
    ).then((questions) => questions);
    return {
      categories: [
        {
          category: _category,
          questions: _questions,
        },
      ],
    };
  }
};

//#region : Private functions
interface IMappingQuestion {
  id: number;
  answer: any[];
  question: {
    id: number;
    text: string;
    type: string; // example: 'multiple-choice'
    answers: {
      text: string;
    }[];
  };
  [k: string]: any; // rest of unnecessary props
}

interface IMappingDataX {
  id: number;
  questions: IMappingQuestion[];
  test_name: string; // example: 'React'
  duration: string; // example: '720.0'
  level: string; // example: 'intermediate'
  [k: string]: any; // rest of unnecessary props
}

const MappingDataX = async (data: IMappingDataX, tempoTitle: string) => {
  const mappedQuestion = await data.questions.map(
    (_q: IMappingQuestion, index: number) => {
      return {
        question: `${index} - ` + tempoTitle,
        // type: _q.question.type,
        answer: 0,
        description: _q.question.text,
        options: _q.question.answers.map((ans: { text: string }) => {
          return {
            value: ans.text,
          };
        }),
      };
    },
  );
  return mappedQuestion;
};
//#endregion : Private functions

export function decodeHtml(html: string) {
  var txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

export function formatTimeString(seconds: number): string {
  if (seconds < 60) {
      return `${seconds} seconds`;
  } else {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      if (remainingSeconds === 0) {
          return `${minutes} mins`;
      } else {
          return `${minutes} mins ${remainingSeconds} seconds`;
      }
  }
}