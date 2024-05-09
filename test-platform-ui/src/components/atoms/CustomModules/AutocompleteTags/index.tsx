/* eslint-disable react/jsx-key */
import { IEmployee } from '@/app/administration/assessments/(components)/autocompleteAddCandidate';
import { useAutocomplete } from '@mui/base/useAutocomplete';
import CheckIcon from '@mui/icons-material/Check';
import {
  InputWrapper,
  Item,
  Label,
  Listbox,
  StyledTag,
  Wrapper,
} from './styles';

interface IAutocompleteTags {
  options?: IEmployee[];
  label?: string;
  selectedCandidates: IEmployee[];
  addCandidate: (candidate: IEmployee) => void;
  removeCandidate: (employees: IEmployee[]) => void;
}

export default function AutocompleteTags({
  options,
  label,
  selectedCandidates,
  addCandidate,
  removeCandidate,
}: IAutocompleteTags) {
  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    id: 'autocomplete-tags',
    defaultValue: undefined,
    multiple: true,
    options: options || [],
    value: selectedCandidates,
    getOptionLabel: (option) => option?.name,
    onChange: (event: any, value: IEmployee[]) => {
      if (
        event.keyCode != 8 &&
        !selectedCandidates.includes(value[value.length - 1])
      ) {
        event.preventDefault();
        addCandidate(value[value.length - 1]);
      }
    },
  });

  return (
    <Wrapper>
      <div {...getRootProps()}>
        <Label {...getInputLabelProps()}>{label}</Label>
        <InputWrapper ref={setAnchorEl} className={focused ? 'focused' : ''}>
          {selectedCandidates?.map((option: IEmployee, index: number) => (
            <StyledTag
              label={option.name}
              {...getTagProps({ index })}
              removeItems={(index: number) => {
                const _tempCandidates = [...selectedCandidates];
                _tempCandidates.splice(index, 1);
                removeCandidate(_tempCandidates);
              }}
            />
          ))}
          <input {...getInputProps()} />
        </InputWrapper>
      </div>
      {groupedOptions.length > 0 && options?.length ? (
        <Listbox {...getListboxProps()}>
          {(groupedOptions as typeof options).map((option, index) => (
            <Item
              isDisabled={selectedCandidates.includes(option)}
              {...getOptionProps({ option, index })}
              value={option.empCode}
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: `<p><b>${option.name}</b> - <i>${option.empCode}</i></p>`,
                }}
              />
              <CheckIcon fontSize="small" />
            </Item>
          ))}
        </Listbox>
      ) : null}
    </Wrapper>
  );
}
