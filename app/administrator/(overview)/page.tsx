import { lusitana } from '@/app/styles/fonts';
import { Suspense } from 'react';
import Loading from './loading';

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
