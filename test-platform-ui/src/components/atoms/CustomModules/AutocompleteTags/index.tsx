'use client';

/* eslint-disable react/jsx-key */
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

export interface IOptions {
  name: string;
  subName?: string;
  [k: string]: any;
}

interface IAutocompleteTags<T> {
  options?: IOptions[];
  label?: string;
  selectedItems: IOptions[];
  addItem: (item: T | IOptions) => void;
  removeItem: (items: T[] | IOptions[]) => void;
  single?: boolean;
}

export default function AutocompleteTags<T>({
  options,
  label,
  selectedItems,
  addItem,
  removeItem,
  single,
}: IAutocompleteTags<T>) {
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
    value: selectedItems,
    getOptionLabel: (option) => option?.name,
    onChange: (event: any, value: IOptions[]) => {
      if (
        event.keyCode != 8 &&
        !selectedItems?.includes(value[value.length - 1])
      ) {
        event.preventDefault();
        addItem(value[value.length - 1]);
      }
    },
  });

  const ListItem = ({ option, index }: { option: IOptions; index: number }) => {
    const isSelected = selectedItems?.includes(option);
    return (
      <Item
        isDisabled={isSelected}
        {...getOptionProps({ option, index })}
        value={option.subName}
      >
        <span
          dangerouslySetInnerHTML={{
            __html: `<p><b>${option.name}</b>${
              option.subName ? `- <i></i>${option.subName}</p>` : ''
            }`,
          }}
        />
        {isSelected ? <CheckIcon fontSize="small" /> : null}
      </Item>
    );
  };

  return (
    <Wrapper>
      <div {...getRootProps()}>
        {label ? <Label {...getInputLabelProps()}>{label}</Label> : null}
        <InputWrapper ref={setAnchorEl} className={focused ? 'focused' : ''}>
          {selectedItems?.map((option: IOptions, index: number) => {
            return (
              <StyledTag
                label={option?.name}
                {...getTagProps({ index })}
                removeItems={(index: number) => {
                  const _tempItems = [...selectedItems];
                  _tempItems.splice(index, 1);
                  removeItem(_tempItems);
                }}
                isSingle={single}
              />
            );
          })}
          <input {...getInputProps()} />
        </InputWrapper>
      </div>
      {groupedOptions.length > 0 && options?.length ? (
        <Listbox {...getListboxProps()}>
          {(groupedOptions as typeof options).map((option, index) => (
            <ListItem option={option} index={index} />
          ))}
        </Listbox>
      ) : null}
    </Wrapper>
  );
}
