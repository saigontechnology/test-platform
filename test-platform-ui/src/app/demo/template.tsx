export default function DemoTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <span>Demo Template</span>
      {children}
    </div>
  );
}
