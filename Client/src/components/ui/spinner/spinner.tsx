import "../../../style/ui.css"


interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: string;
    label?: string;
    fullPage?: boolean;
}

export const Spinner = ({
    size = 'md',
    color = '#3b82f6',
    label,
    fullPage = false,
}: SpinnerProps) => {
    const sizeMap = {
        sm: '16px',
        md: '32px',
        lg: '48px',
    };

    const spinner = (
        <div className={`spinner-container ${fullPage ? 'spinner-fullpage' : ''}`}>
            <div
                className={`spinner spinner-${size}`}
                style={{
                    width: sizeMap[size],
                    height: sizeMap[size],
                    borderColor: color,
                    borderTopColor: 'transparent',
                }}
            />
            {label && <p className="spinner-label">{label}</p>}
        </div>
    );

    if (fullPage) {
        return (
            <div className="spinner-overlay">
                {spinner}
            </div>
        );
    }

    return spinner;
};