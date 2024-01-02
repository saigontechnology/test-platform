import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import Loading from './loading';
// import { Suspense } from 'react';

export default async function Page() {
  return (
    <main>
      <Suspense fallback={<Loading />}>
        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
          Dashboard
        </h1>
      </Suspense>
    </main>
  );
}
