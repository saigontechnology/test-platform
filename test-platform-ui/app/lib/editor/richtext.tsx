import {
  calc_image_size_base64,
  convertBase64,
  resize_base64,
} from '@/app/lib/utils';
import React, { ElementRef, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import ReactQuill, { ReactQuillProps } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Editor, Modules } from './quillConfig';
interface IRichTextArea extends ReactQuillProps {
  name: string;
  placeholder?: string;
}

const RichTextArea: React.FC<IRichTextArea> = ({ name, placeholder }) => {
  const [editorHtml, setEditorHtml] = useState<string>();
  const quillRef = React.useRef<ElementRef<typeof ReactQuill>>(null);
  const { setValue } = useFormContext();

  const Handlers = {
    imageHandlers: async () => {
      const input = document.createElement('input');

      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();
      input.onchange = async () => {
        const file: any = input && input.files ? input.files[0] : null;
        console.log('file information: ', file);
        const formData = new FormData();
        formData.append('file', file);
        await Handlers.handleCompressed(file);
      };
    },
    handleCompressed: async (uploadFile: any) => {
      const base64 = await convertBase64(uploadFile);
      /** Validate image size compress on greater than 1mb */
      if (calc_image_size_base64(base64 as string) > 1) {
        const _compressed = await Handlers.handleUploadImage(
          base64 as string,
        ).then((result) => result);
        Handlers.handleEmbedImage(_compressed as any);
      } else {
        Handlers.handleEmbedImage(base64 as any);
      }
    },
    handleUploadImage: async (base64: string) => {
      let result_resize = null;
      await resize_base64(base64).then((result) => (result_resize = result));
      return result_resize;
    },
    handleEmbedImage: (compressedImage: string) => {
      if (!quillRef.current) {
        return;
      }
      const editor = quillRef.current?.getEditor() as ReturnType<
          typeof quillRef.current.getEditor
        >,
        range = editor.getSelection(true);

      if (range) {
        try {
          editor.insertEmbed(range?.index, 'image', compressedImage);
        } catch (err: any) {
          console.log('embed quill err:', err);
        }
      }
    },
    handleSetInputValues: (editorHtml: string) => {
      setValue('content', editorHtml);
    },
  };

  const QuillModules = useMemo(() => {
    /*
     * Quill modules to attach to editor
     * See https://quilljs.com/docs/modules/ for complete options
     */
    Modules.toolbar.handlers = {
      image: Handlers.imageHandlers,
    };
    return Modules;
  }, []);

  return (
    <>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        onChange={(val) => Handlers.handleSetInputValues(val)}
        modules={QuillModules}
        formats={Editor.formats}
        bounds={'.app'}
        placeholder={placeholder}
      />
    </>
  );
};
export default RichTextArea;
