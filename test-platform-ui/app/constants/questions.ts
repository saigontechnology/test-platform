enum Category {
  React,
  Typescript,
  Javascript,
  Golang,
  ReactNative,
}
export const CategoriesOptions = [
  {
    label: 'React',
    value: Category.React,
  },
  {
    label: 'React Native',
    value: Category.ReactNative,
  },
  {
    label: 'Typescript',
    value: Category.React,
  },
  {
    label: 'Javascript',
    value: Category.Javascript,
  },
  {
    label: 'Golang',
    value: Category.Golang,
  },
];

// Temporary questions list:
export const questionRows = [
  {
    id: 1,
    title: 'Interview question',
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    catgories: ['React JS'],
    answers: ['Answer No.01', 'Answer No.02', 'Answer No.03', 'Answer No.04'],
  },
  {
    id: 2,
    title: 'Interview question',
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    catgories: ['React JS'],
    answers: ['Answer No.01', 'Answer No.02', 'Answer No.03', 'Answer No.04'],
  },
  {
    id: 3,
    title: 'Interview question',
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    catgories: ['React JS'],
    answers: ['Answer No.01', 'Answer No.02', 'Answer No.03', 'Answer No.04'],
  },
  {
    id: 4,
    title: 'Interview question',
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    catgories: ['React JS'],
    answers: ['Answer No.01', 'Answer No.02', 'Answer No.03', 'Answer No.04'],
  },
  {
    id: 5,
    title: 'Interview question',
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    catgories: ['React JS'],
    answers: ['Answer No.01', 'Answer No.02', 'Answer No.03', 'Answer No.04'],
  },
  {
    id: 6,
    title: 'Interview question',
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    catgories: ['React JS'],
    answers: ['Answer No.01', 'Answer No.02', 'Answer No.03', 'Answer No.04'],
  },
  {
    id: 7,
    title: 'Interview question',
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    catgories: ['React JS'],
    answers: ['Answer No.01', 'Answer No.02', 'Answer No.03', 'Answer No.04'],
  },
  {
    id: 8,
    title: 'Interview question',
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    catgories: ['React JS'],
    answers: ['Answer No.01', 'Answer No.02', 'Answer No.03', 'Answer No.04'],
  },
  {
    id: 9,
    title: 'Interview question',
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    catgories: ['React JS'],
    answers: ['Answer No.01', 'Answer No.02', 'Answer No.03', 'Answer No.04'],
  },
];

export interface ICreateQuestion {
  title: string;
  content: string;
  type: string;
}
