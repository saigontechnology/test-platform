'use client';

import { ROUTE_KEY } from '@/constants/routePaths';
import { yupResolver } from '@hookform/resolvers/yup';
import Dialog from '@mui/material/Dialog';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import ModifyAssessment from '../(components)/modifyAssessment';

const CreatePage = () => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(true);

  const schema = yup.object({
    name: yup.string().required(),
  });

  const {
    handleSubmit,
    register,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => {
    console.log('create', data.name);
    setIsDialogOpen(false);
  };

  const handleCancel = (e: any) => {
    e.preventDefault();
    debugger;
    router.push(ROUTE_KEY.ADMINISTRATION_ASSESSMENTS);
  };

  return (
    <>
      <Dialog open={isDialogOpen} maxWidth="xs" fullWidth={true}>
        <div className="p-4">
          <div className="text-center font-medium">Create a new assessment</div>
          <div className="mt-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                type="text"
                className="w-full rounded border border-gray-200 p-2 text-sm"
                placeholder="Enter name of assessment..."
                autoFocus
                {...register('name')}
              />
              <div className="mt-4 flex justify-end">
                <div className="flex flex-row-reverse gap-2">
                  <button
                    type="submit"
                    className={`flex justify-end rounded border border-transparent bg-primary px-8 py-2 text-sm text-white ${isValid ? 'opacity-100' : 'opacity-70'}`}
                  >
                    New Assessment
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex justify-end rounded border border-primary bg-white px-8 py-2 text-sm text-primary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
      <ModifyAssessment />;
    </>
  );
};

export default CreatePage;
