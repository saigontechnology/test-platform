import React from 'react';
import './flagChip.scss';

function FlagChip({
  customClass,
  label,
}: {
  customClass?: string;
  label?: string;
}) {
  return (
    <div className={`flag-chip-container ${customClass || ''}`}>
      <div className="triangle-right" />
      <span>{label}</span>
    </div>
  );
}

export default React.memo(FlagChip);
