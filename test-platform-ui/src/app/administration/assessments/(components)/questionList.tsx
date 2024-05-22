'use client';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';

export default function QuestionList(props) {
  const skills = [
    {
      name: 'React',
      logo: '',
      questions: 15,
    },
    {
      name: 'Javascript',
      logo: '',
      questions: 18,
    },
    {
      name: 'HTML',
      logo: '',
      questions: 12,
    },
    {
      name: 'CSS',
      logo: '',
      questions: 13,
    },
  ];
  return (
    <div className="grid grid-cols-4">
      <div className="border border-gray-200">
        <div className="bg-gray-100 p-4 text-sm font-medium">Skill</div>
        <FormGroup>
          {skills.map((skill) => {
            return (
              <div className="flex items-center justify-between px-2">
                <FormControlLabel
                  control={<Checkbox value={skill.name} />}
                  label={skill.name}
                />
                <span className="text-sm text-gray-400">{skill.questions}</span>
              </div>
            );
          })}
        </FormGroup>
      </div>
      <div className="col-span-3 border border-gray-200 p-4 text-center">
        Question List
      </div>
    </div>
  );
}
