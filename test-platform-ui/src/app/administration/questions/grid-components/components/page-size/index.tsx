import React from 'react';
import './styles.scss';

function PageSizeDropdown({
  options,
  onPageSizeChange,
  pageSize,
}: {
  options: any;
  onPageSizeChange: any;
  pageSize: number;
}) {
  const handleChange = (event: any) => {
    const newSize = parseInt(event.target.value, 10);
    onPageSizeChange(newSize);
  };

  return (
    <div className="page-size-dropdown">
      <select id="page-size" value={pageSize} onChange={handleChange}>
        {options.map((size: any) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  );
}

export default React.memo(PageSizeDropdown);
