import AutocompleteTags, {
  IOptions,
} from '@/components/atoms/CustomModules/AutocompleteTags';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

export interface IEmployee extends IOptions {
  name: string;
  empCode?: string;
  email?: string;
}

const EmployeeEmails: IEmployee[] = [
  {
    name: 'Han Tran',
    empCode: 'han.tran',
    email: 'han.tran@saigontechnology.com',
  },
  {
    name: 'Nam Nguyen Khanh',
    empCode: 'nam.nguyenkhanh',
    email: 'nam.nguyenkhanh@saigontechnology.com',
  },
  {
    name: 'Nam Tran Chi',
    empCode: 'nam.tranchi',
    email: 'nam.tranchi@saigontechnology.com',
  },
  {
    name: 'Minh Nguyen Nhat',
    empCode: 'minh.nguyennhat',
    email: 'minh.nguyennhat@saigontechnology.com',
  },
  {
    name: 'Phuc Huynh',
    empCode: 'phuc.huynhvt',
    email: 'phuc.huynhvt@saigontechnology.com',
  },
  {
    name: 'Hao Nguyen',
    empCode: 'hao.nguyen',
    email: 'hao.nguyen@saigontechnology.com',
  },
  {
    name: 'Hung Le',
    empCode: 'hung.le2',
    email: 'hung.le2@saigontechnology.com',
  },
];

export default function AccordionExpandIcon() {
  const { setValue, getValues } = useFormContext();
  const [candidates, setCandidates] = useState<IEmployee[]>([]);

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
      options={EmployeeEmails}
      selectedItems={candidates}
      addItem={handleAddCandidate}
      removeItem={handleRemoveCandidate}
      label="Employee Email(s) :"
    />
  );
}
