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
  ],
};
//#endregion

/**
 *
 * @param customize is a objects of personal customize
 * @returns
 */
export const Modules = {
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
      ['image'],
    ],
    handlers: {},
  },
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};
