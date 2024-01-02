'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';

/** Custom deBounce function in Next.js: https://dev.to/codeofrelevancy/debounce-in-nextjs-4b4m */
export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    /** 
     * Create search query with multiple parameters
     * const createParams = (obj) => {
        return new URLSearchParams(Object.fromEntries(Object.entries(obj).filter(([,value]) => value !== undefined))).toString()
      }

      console.log(createParams({name: "John", un: undefined, another: 1}))
      // name=John&another=1
    */
    params.set('page', '1');
    console.log(`Searching... ${term}`);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 400);

  useEffect(() => {
    // todo on re-render
    return () => {
      params.delete('query');
    };
  });

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
