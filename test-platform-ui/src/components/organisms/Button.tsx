import styles from '@/styles/modules/button.module.scss';

interface IButton {
    isDisabled: boolean;
    label: string;
    onClick: () => void;
}

export const CSButton = (props: IButton) => {
    const {isDisabled, label, onClick} = props;
    return (
        <div className={isDisabled ? styles.disabled : styles.customButton} onClick={onClick}>
            <div className={styles.slidEffect} />
            <span className={styles.label}>{label}</span>
        </div>
    )
}
