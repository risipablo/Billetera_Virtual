import "../../../style/ui.css"

interface SkeletonProps {
    type?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
    rows?: number;
    columns?: number;
    className?: string;
}

export const Skeleton = ({
    type = 'text',
    width = '100%',
    height = '20px',
    rows = 1,
    columns = 1,
    className = '',
}: SkeletonProps) => {
    // Si es table, renderizar filas y columnas
    if (rows > 1 || columns > 1) {
        return (
            <div className="skeleton-table-wrapper">
                {/* Header */}
                <div className="skeleton-header">
                    {Array.from({ length: columns }).map((_, i) => (
                        <div key={`header-${i}`} className="skeleton-cell skeleton-header-cell" />
                    ))}
                </div>
                
                {/* Rows */}
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <div key={`row-${rowIndex}`} className="skeleton-row">
                        {Array.from({ length: columns }).map((_, colIndex) => (
                            <div key={`cell-${rowIndex}-${colIndex}`} className="skeleton-cell" />
                        ))}
                    </div>
                ))}
            </div>
        );
    }

    
    return (
        <div
            className={`skeleton skeleton-${type} ${className}`}
            style={{ width, height }}
        />
    );
};