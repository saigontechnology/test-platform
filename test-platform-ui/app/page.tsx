'use client';

import styles from '@/app/styles/home.module.css';
import Login from './components/logIn';
// import { lusitana } from './styles/fonts';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52" />
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <div className={styles.shape} />
          <p className={`text-xl text-gray-800 md:text-3xl md:leading-normal`}>
            <strong>Welcome to Examination Platform.</strong> This is the
            example for the Technical Assessment
          </p>
          <Login />
        </div>
      </div>
    </main>
  );
}
