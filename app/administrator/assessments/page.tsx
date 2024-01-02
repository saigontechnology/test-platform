import { lusitana } from '@/app/ui/fonts';
// import { Suspense } from 'react';

export default async function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Assessment Page
      </h1>
    </main>
  );
}
