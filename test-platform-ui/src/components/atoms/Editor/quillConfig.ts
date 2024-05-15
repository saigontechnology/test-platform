import hljs from 'highlight.js';

export const Editor = {
  /*
   * Quill editor formats
   * See https://quilljs.com/docs/formats/
   */
  formats: [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
    'code-block',
  ],
};
//#endregion

/**
 * @param customize is a objects of personal customize
 * @returns
 */

hljs.configure({
  languages: ['javascript', 'ruby', 'python', 'rust'],
});

export const Modules = {
  syntax: {
    highlight: (text: string) => hljs.highlightAuto(text).value,
  },
  toolbar: {
    container: [
      [{ header: '1' }, { header: '2' }],
      ['bold', 'italic', 'underline', 'strike'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['image', 'code-block'],
    ],
    handlers: {},
  },
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};
