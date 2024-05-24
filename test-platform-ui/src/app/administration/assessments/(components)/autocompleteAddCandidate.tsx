import AutocompleteTags, {
  IOptions,
} from '@/components/atoms/CustomModules/AutocompleteTags';
import { useGetCandidates } from '@/hooks/user/hooks';
import { useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';

export interface IEmployee extends IOptions {
  name: string;
  subName: string;
  empCode: string;
  email: string;
}

const EmployeeEmails: IEmployee[] = [
  {
    name: 'Han Tran',
    subName: 'han.tran',
    empCode: 'han.tran',
    email: 'han.tran@saigontechnology.com',
  },
  {
    name: 'Nam Nguyen Khanh',
    subName: 'nam.nguyenkhanh',
    empCode: 'nam.nguyenkhanh',
    email: 'nam.nguyenkhanh@saigontechnology.com',
  },
  {
    name: 'Nam Tran Chi',
    subName: 'nam.tranchi',
    empCode: 'nam.tranchi',
    email: 'nam.tranchi@saigontechnology.com',
  },
  {
    name: 'Minh Nguyen Nhat',
    subName: 'minh.nguyennhat',
    empCode: 'minh.nguyennhat',
    email: 'minh.nguyennhat@saigontechnology.com',
  },
  {
    name: 'Phuc Huynh',
    subName: 'phuc.huynhvt',
    empCode: 'phuc.huynhvt',
    email: 'phuc.huynhvt@saigontechnology.com',
  },
  {
    name: 'Hao Nguyen',
    subName: 'hao.nguyen',
    empCode: 'hao.nguyen',
    email: 'hao.nguyen@saigontechnology.com',
  },
  {
    name: 'Hung Le',
    subName: 'hung.le2',
    empCode: 'hung.le2',
    email: 'hung.le2@saigontechnology.com',
  },
  {
    name: 'Dat Ngo',
    subName: 'dat.ngo',
    empCode: 'dat.ngo',
    email: 'dat.ngo@saigontechnology.com',
  },
  {
    name: 'Tan Vo',
    subName: 'tan.vo',
    empCode: 'tan.vo',
    email: 'tan.vo@saigontechnology.com',
  },
];

export default function AccordionExpandIcon() {
  const { setValue, getValues } = useFormContext();
  const [candidates, setCandidates] = useState<IEmployee[]>([]);

  const candidate = useGetCandidates();

  const candidateFormats = useMemo(() => {
    return candidate.data?.map((item) => {
      return {
        name: `${item.lastName} ${item.firstName}`,
        empCode: item.empCode,
      };
    });
  }, [candidate]);

  console.log('candidate', candidate.data);

  const handleAddCandidate = (new_candidate: IEmployee) => {
    if (new_candidate) {
      setCandidates(candidates.concat(new_candidate));
      setValue(
        'email',
        getValues('email').concat(new_candidate.empCode || new_candidate.email),
      );
    }
  };

  const handleRemoveCandidate = (modifiedCandidates: IEmployee[]) => {
    const updatedCandidates = modifiedCandidates.map(
      (_i: IEmployee) => _i.empCode || _i.email,
    );
    setCandidates(modifiedCandidates);
    setValue('email', updatedCandidates);
  };

  return (
    <AutocompleteTags
      options={candidateFormats}
      selectedItems={candidates}
      addItem={(item) => handleAddCandidate(item as IEmployee)}
      removeItem={(items) => handleRemoveCandidate(items as IEmployee[])}
      label="Employee Email(s) :"
    />
  );
}
