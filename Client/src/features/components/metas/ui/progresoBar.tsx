import { motion } from 'framer-motion';

interface ProgresoBarProps {
    progreso: number;
    color?: string;
    height?: number;
}

export const ProgresoBar = ({
    progreso,
    color = '#3b82f6',
    height = 8
}: ProgresoBarProps) => {
    const safe = Math.min(100, Math.max(0, progreso));

    return (
        <div
            style={{
                width: '100%',
                height,
                background: '#e5e7eb',
                borderRadius: height / 2,
                overflow: 'hidden'
            }}
        >
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${safe}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{
                    height: '100%',
                    background: color,
                    borderRadius: height / 2
                }}
            />
        </div>
    );
};