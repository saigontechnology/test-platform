import CloseIcon from '@mui/icons-material/Close';
import {
  AutocompleteGetTagProps,
  Typography,
  autocompleteClasses,
} from '@mui/material';
import { styled } from '@mui/material/styles';

export interface TagProps extends ReturnType<AutocompleteGetTagProps> {
  label: string;
  removeItems: (index: number) => void;
  isSingle?: boolean;
}

function Tag(props: TagProps) {
  const { label, onDelete, removeItems, isSingle, ...other } = props;
  return (
    <div {...other}>
      <span>{label}</span>
      {isSingle ? null : (
        <CloseIcon onClick={() => removeItems(other['data-tag-index'])} />
      )}
    </div>
  );
}

export const Wrapper = styled('div')(
  ({ theme }) => `
    color: ${
      theme.palette.mode === 'dark'
        ? 'rgba(255,255,255,0.65)'
        : 'rgba(0,0,0,.85)'
    };
    font-size: 14px;
    padding: 10px 0px;
  `,
);

export const Label = styled('label')`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
`;

export const InputWrapper = styled('div')(
  ({ theme }) => `
    border: 1px solid ${theme.palette.mode === 'dark' ? '#434343' : '#d9d9d9'};
    background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
    border-radius: 4px;
    padding: 1px;
    display: flex;
    flex-wrap: wrap;
  
    &:hover {
      border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
    }
  
    &.focused {
      border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }
  
    & input {
      background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
      color: ${
        theme.palette.mode === 'dark'
          ? 'rgba(255,255,255,0.65)'
          : 'rgba(0,0,0,.85)'
      };
      height: 30px;
      box-sizing: border-box;
      padding: 4px 6px;
      width: 0;
      min-width: 30px;
      flex-grow: 1;
      border: 0;
      margin: 0;
      outline: 0;
    }
  `,
);

export const StyledTag = styled(Tag)<TagProps>(
  ({ theme }) => `
    display: flex;
    align-items: center;
    height: 24px;
    margin: 2px;
    line-height: 22px;
    background-color: ${
      theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#fafafa'
    };
    border: 1px solid ${theme.palette.mode === 'dark' ? '#303030' : '#e8e8e8'};
    border-radius: 2px;
    box-sizing: content-box;
    padding: 0 4px 0 10px;
    outline: 0;
    overflow: hidden;
  
    &:focus {
      border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
      background-color: ${
        theme.palette.mode === 'dark' ? '#003b57' : '#e6f7ff'
      };
    }
  
    & span {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  
    & svg {
      font-size: 20px;
      cursor: pointer;
      padding: 4px;
    }
  `,
);

export const Listbox = styled('ul')(
  ({ theme }) => `
    width: 100%;
    margin: 2px 0 0;
    padding: 0;
    position: absolute;
    list-style: none;
    background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
    overflow: auto;
    max-height: 250px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 1;
  
    & li {
      padding: 5px 12px;
      display: flex;
  
      & span {
        flex-grow: 1;
      }
  
      & svg {
        color: transparent;
      }
    }
  
    & li[aria-selected='true'] {
      background-color: ${
        theme.palette.mode === 'dark' ? '#2b2b2b' : '#fafafa'
      };
      font-weight: 600;
  
      & svg {
        color: #1890ff;
      }
    }
  
    & li.${autocompleteClasses.focused} {
      background-color: ${
        theme.palette.mode === 'dark' ? '#003b57' : '#e6f7ff'
      };
      cursor: pointer;
  
      & svg {
        color: currentColor;
      }
    }
  `,
);

export const Item = styled('li')<{ isDisabled: boolean }>`
  pointer-events: ${({ isDisabled }) => (isDisabled ? 'none' : 'inherit')};
`;

export const TitleWLine = styled(Typography)(
  () => `
    position: relative;
    z-index: 1;

    &:before {
        border-top: 2px solid #dfdfdf;
        content:"";
        /* this centers the line to the full width specified */
        margin: 0 auto; 
        /* positioning must be absolute here, and relative positioning must be applied to the parent */
        position: absolute; 
        top: 50%; left: 0; right: 0; bottom: 0;
        width: 95%;
        z-index: -1;
    }

    span { 
        /* to hide the lines from behind the text, you have to set the background color the same as the container */ 
        background: #fff; 
        padding: 0 15px; 
    }
`,
);
