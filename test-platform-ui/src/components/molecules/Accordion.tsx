import { Autocomplete, TextField } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import CustomTextField from '../atoms/CustomModules/CustomTextField';

interface IEmployee {
  name: string;
  email: string;
}

const EmployeeEmails: IEmployee[] = [
  {
    name: 'Han Tran',
    email: 'han.tran@saigontechnology.com',
  },
  {
    name: 'Nam Nguyen Khanh',
    email: 'nam.nguyenkhanh@saigontechnology.com',
  },
  {
    name: 'Nam Tran Chi',
    email: 'nam.tranchi@saigontechnology.com',
  },
  {
    name: 'Minh Nguyen Nhat',
    email: 'minh.nguyennhat@saigontechnology.com',
  },
  {
    name: 'Phuc Huynh',
    email: 'phuc.huynhvt@saigontechnology.com',
  },
  {
    name: 'Hao Nguyen',
    email: 'hao.nguyen@saigontechnology.com',
  },
];

export default function AccordionExpandIcon() {
  const { setValue } = useFormContext();
  const [expanded, setExpanded] = useState<string | false>('candidate');
  const [invitationEmail, setInvitationEmail] = useState<IEmployee | null>(
    null,
  );

  const defaultProps = {
    options: EmployeeEmails,
    getOptionLabel: (option: IEmployee) => option.name,
  };

  const handleAccordionChange = useCallback((_accordion: string) => {
    setExpanded(_accordion);
  }, []);

  return (
    <div>
      <Accordion
        expanded={expanded === 'candidate'}
        onChange={() => handleAccordionChange('candidate')}
      >
        <AccordionSummary aria-controls="panel1-content" id="panel1-header">
          <Typography>Candidate Email</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CustomTextField name="email" customClass="w-full" />
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'employee'}
        onChange={() => handleAccordionChange('employee')}
      >
        <AccordionSummary aria-controls="panel2-content" id="panel2-header">
          <Typography>Employee Email</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Autocomplete
            {...defaultProps}
            id="invitation-email"
            disableCloseOnSelect
            value={invitationEmail}
            onChange={(event: React.FormEvent, newValue: IEmployee | null) => {
              event.preventDefault();
              const invit_emp = EmployeeEmails.find(
                (emp) => newValue && emp.name === newValue.name,
              );
              if (invit_emp) {
                setInvitationEmail(invit_emp);
                setValue('email', invit_emp.email);
              }
            }}
            renderInput={(params) => (
              <TextField {...params} variant="standard" />
            )}
          />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
