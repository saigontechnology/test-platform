'use client';

import {
  calc_image_size_base64,
  convertBase64,
  resize_base64,
} from '@/libs/utils';
import React, { ElementRef, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import ReactQuill, { ReactQuillProps } from 'react-quill';

import 'react-quill/dist/quill.snow.css';
import { Editor, Modules } from './quillConfig';

interface IRichTextArea extends ReactQuillProps {
  name: string;
  placeholder?: string;
  data?: string;
}

export default function RichTextArea(props: IRichTextArea) {
  const { placeholder, data, name } = props;
  const quillRef = React.useRef<ElementRef<typeof ReactQuill>>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { setValue } = useFormContext();

  const Handlers = {
    imageHandlers: async () => {
      if (inputRef.current) {
        const _input = inputRef.current;
        _input.click();
        _input.onchange = async () => {
          const file: any = _input && _input.files ? _input.files[0] : null,
            formData = new FormData();
          formData.append('file', file);
          await Handlers.handleCompressed(file);
        };
      }
      // }
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
      setValue(name, editorHtml);
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
    return Modules || {};
  }, []);

  return (
    <>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        onChange={(val) => Handlers.handleSetInputValues(val)}
        value={data}
        modules={QuillModules}
        formats={Editor.formats}
        bounds={'.app'}
        placeholder={placeholder}
      />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
      />
    </>
  );
}
