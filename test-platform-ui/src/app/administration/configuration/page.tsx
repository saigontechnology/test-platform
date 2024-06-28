'use client';

import ApiHook, { Methods } from '@/libs/apis/ApiHook';
import { useEffect } from 'react';

export default function ConfigurationContainer() {
  const getPermissions = async (roleId?: number) => {
    const { data, error } = await ApiHook(
      Methods.GET,
      `/admin/permissions${roleId ? '/' + roleId : ''}`,
    );
    console.log('getPermissions data: ', data, error);
  };

  useEffect(() => {}, []);

  return <div onClick={() => getPermissions()}>Configuration</div>;
}
