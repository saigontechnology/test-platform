'use client';

import {
  calc_image_size_base64,
  convertBase64,
  resize_base64,
} from '@/libs/utils';
import hljs from 'highlight.js';
import dynamic from 'next/dynamic';
import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import ReactQuill, { ReactQuillProps } from 'react-quill';
import { Editor, Modules } from './quillConfig';

import 'highlight.js/styles/atom-one-dark-reasonable.css';
import 'react-quill/dist/quill.snow.css';

interface IRichTextArea extends ReactQuillProps {
  name: string;
  placeholder?: string;
  data?: string;
}
interface CustomQuillProps extends ReactQuill.ReactQuillProps {
  hookRef: (ref: ReactQuill | null) => void;
}

/** Dynamic import ReactQuill, with Hightlight Js configuration: */
const CustomReactQuill = dynamic(
  async () => {
    hljs.configure({
      // optionally configure hljs
      languages: ['javascript', 'typescript', 'html', 'css', 'python'],
    });
    // @ts-ignore
    window.hljs = hljs;
    const { default: RQ } = await import('react-quill');

    return function ReactQuillHoc(props: CustomQuillProps) {
      const { hookRef, ...rest } = props;
      // eslint-disable-next-line react/jsx-props-no-spreading
      return <RQ ref={hookRef} {...{ ...rest }} />;
    };
  },
  {
    ssr: false,
    loading: () => <div>Loading...</div>,
  },
);

/** Main module content: */
export default function RichTextArea(props: IRichTextArea) {
  const { placeholder, data, name } = props;
  // const quillRef = React.useRef<ElementRef<typeof ReactQuill>>(null);
  let quillRef: ReactQuill | null = null;
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
      if (!quillRef) {
        return;
      }
      const editor = quillRef?.getEditor() as ReturnType<
          typeof quillRef.getEditor
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
      <CustomReactQuill
        hookRef={(ref: ReactQuill | null) => ref && (quillRef = ref)}
        theme="snow"
        value={data}
        modules={QuillModules}
        onChange={(val) => Handlers.handleSetInputValues(val)}
        bounds={'.app'}
        placeholder={placeholder}
        formats={Editor.formats}
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
