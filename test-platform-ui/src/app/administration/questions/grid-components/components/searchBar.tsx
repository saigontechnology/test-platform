import useDebounce from '@/libs/useDebounce';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { useEffect, useRef, useState } from 'react';

export default function SearchBar({
  placeholder,
  isFocus = false,
  onSearch,
  onClear,
  debounceTime = 1000,
}: {
  placeholder: string;
  isFocus?: boolean;
  onSearch: (searchValue: string) => void;
  onClear: () => void;
  debounceTime?: number;
  numberChars4Search?: number;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const debouncedSearchTerm = useDebounce(inputValue, debounceTime);

  useEffect(() => {
    if (debouncedSearchTerm) {
      onSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  const handleClearSearch = (evt?: React.MouseEvent) => {
    evt?.preventDefault();
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onClear();
  };

  return (
    <div className="search-bar relative">
      <input
        ref={inputRef}
        id="TFSearch"
        type="search"
        placeholder={placeholder}
        required
        autoFocus={isFocus}
        onChange={(evt: React.ChangeEvent) => {
          evt?.preventDefault();
          inputRef.current?.value?.trim().length
            ? setInputValue(inputRef.current?.value)
            : handleClearSearch();
        }}
      />
      <button type="submit" onClick={handleClearSearch}>
        <SearchOffIcon style={{ color: 'rgb(255, 255, 255)' }} />
      </button>
    </div>
  );
}
