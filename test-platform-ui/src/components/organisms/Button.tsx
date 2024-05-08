import styles from '@/styles/modules/button.module.scss';

interface IButton {
  isDisabled?: boolean;
  label: string;
  customClass?: string;
  onClick: () => void;
}

export const CSButton = (props: IButton) => {
  const { isDisabled, label, onClick, customClass } = props;
  return (
    <div
      className={`${
        isDisabled ? styles.disabled : styles.customButton
      } ${customClass}`}
      onClick={onClick}
    >
      <div className={styles.slidEffect} />
      <span className={styles.label}>
        <b>{label}</b>
      </span>
    </div>
  );
};
