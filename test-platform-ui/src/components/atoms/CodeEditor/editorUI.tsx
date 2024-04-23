import { LiveEditor, LivePreview, LiveProvider } from 'react-live';

const sampleCodeUI = `
    <h3 style={{
        background: 'darkslateblue',
        color: 'white',
        padding: 8,
        borderRadius: 4
    }}>
        Hello World! 👋
    </h3> 
`;

interface IEditorUI {
  customClass?: string;
}

export default function EditorUI({ customClass: classes }: IEditorUI) {
  return (
    <LiveProvider code={sampleCodeUI}>
      <div className={`grid grid-cols-2 gap-4 ${classes || ''}`}>
        <LiveEditor className="font-mono" />
        <LivePreview />
      </div>
    </LiveProvider>
  );
}
