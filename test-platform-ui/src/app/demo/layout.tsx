export default function DemoLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <span>Layout</span>
      {children}
    </section>
  );
}
