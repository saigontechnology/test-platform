'use client';

import DashboardCard from '@/components/molecules/DashboardCard';
import { AssessmentLevels, IAssessment } from '@/constants/assessments';
import { ROUTE_KEY } from '@/constants/routePaths';
import ApiHook, { Methods } from '@/libs/apis/ApiHook';
import { yupResolver } from '@hookform/resolvers/yup';
import Dialog from '@mui/material/Dialog';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

export default function AssessmentList() {
  const [assessments, setAssessments] = useState<IAssessment[]>([]);
  const router = useRouter();

  const [isDialogCreateOpen, setIsDialogCreateOpen] = useState<boolean>(false);
  const [levels, setLevels] = useState([]);
  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState<boolean>(false);
  const [deletedId, setDeletedId] = useState<number>();

  const getAssessments = async () => {
    const response: any = await ApiHook(Methods.GET, '/admin/assessments');
    setAssessments(response.data);
  };

  useEffect(() => {
    getAssessments();
  }, []);

  const assessmentLevel: any = {
    [AssessmentLevels.JUNIOR]: 'Junior',
    [AssessmentLevels.INTERMEDIATE]: 'Intermediate',
    [AssessmentLevels.SENIOR]: 'Senior',
    [AssessmentLevels.PRINCIPAL]: 'Principal',
  };

  const schema = yup.object({
    name: yup.string().required(),
    level: yup.string().required(),
  });

  const {
    handleSubmit,
    register,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    getLevels();
  }, []);

  const getLevels = async () => {
    const response: any = await ApiHook(
      Methods.GET,
      '/admin/questions/filters',
    );

    setLevels(
      response.data.level.map((item: string) => {
        return {
          label: assessmentLevel[item],
          value: item,
        };
      }),
    );
  };

  const onSubmit = async (data: any) => {
    const response: any = await ApiHook(Methods.POST, '/admin/assessments', {
      data,
    });
    router.push(
      `${ROUTE_KEY.ADMINISTRATION_ASSESSMENTS_DETAIL}/${response.data.id}`,
    );
  };

  const handleCancel = (e: any) => {
    e.preventDefault();
    setIsDialogCreateOpen(false);
  };

  const handleCreate = () => {
    setIsDialogCreateOpen(true);
  };

  const handleDelete = async () => {
    await ApiHook(Methods.DELETE, `/admin/assessments/${deletedId}`);
    setAssessments(
      assessments.filter((item: IAssessment) => item.id !== deletedId),
    );
    setIsDialogDeleteOpen(false);
  };

  const handleOpenDeleteDialog = (id: number) => {
    setIsDialogDeleteOpen(true);
    setDeletedId(id);
  };

  return (
    <>
      <div className="bg-white p-4">
        <div className="flex justify-end">
          <button
            onClick={handleCreate}
            className="flex justify-end rounded bg-primary px-8 py-2 text-white"
          >
            New Assessment
          </button>
        </div>

        <div className="col-span-2 mt-4 grid grid-cols-1 gap-4 rounded md:grid-cols-2 lg:grid-cols-3">
          {assessments.length
            ? assessments.map((assessment) => {
                return (
                  <DashboardCard
                    name={assessment.name}
                    level={assessment.level}
                    questions={assessment.assessmentQuestionMapping.length}
                    duration={assessment.duration}
                    active={assessment.active || false}
                    id={assessment.id}
                    key={assessment.id}
                    href={`${ROUTE_KEY.ADMINISTRATION_ASSESSMENTS_DETAIL}/${assessment.id}`}
                    hasDelete
                    onDelete={handleOpenDeleteDialog}
                  />
                );
              })
            : null}
        </div>
      </div>
      <Dialog open={isDialogCreateOpen} maxWidth="xs" fullWidth={true}>
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
              <select
                {...register('level')}
                defaultValue=""
                className="mt-4 w-full rounded border border-gray-200 p-2 text-sm"
              >
                <option disabled hidden value="" data-testid="placeholder">
                  Select level...
                </option>
                {levels.map((item: any, index: number) => {
                  return (
                    <option
                      value={item.value}
                      key={index}
                      disabled={item.disabled}
                    >
                      {item.label}
                    </option>
                  );
                })}
              </select>
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
      <Dialog open={isDialogDeleteOpen} maxWidth="xs" fullWidth={true}>
        <div className="p-4">
          <div className="text-center font-medium">Delete assessment</div>
          <div className="mt-8">
            <p className="text-center text-sm">
              Are you sure you want to delete this assessment?
            </p>
            <div className="mt-8 flex justify-end">
              <div className="flex flex-row-reverse gap-2">
                <button
                  onClick={handleDelete}
                  className={`flex justify-end rounded border border-transparent bg-red-500 px-8 py-2 text-sm text-white`}
                >
                  Delete
                </button>
                <button
                  onClick={() => setIsDialogDeleteOpen(false)}
                  className="flex justify-end rounded border border-gray-500 bg-white px-8 py-2 text-sm text-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
