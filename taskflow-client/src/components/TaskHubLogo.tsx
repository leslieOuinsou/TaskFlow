// Reusable TaskHub logo icon component using the official brand SVG.
// Use the `size` prop to control the rendered dimensions in pixels.

interface TaskHubLogoProps {
    size?: number;
    className?: string;
}

export default function TaskHubLogo({ size = 32, className = '' }: TaskHubLogoProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            width={size}
            height={size}
            className={className}
            aria-label="TaskHub logo"
        >
            <rect x="10" y="10" width="80" height="80" rx="20" fill="#1976D2" />
            <rect x="30" y="25" width="26" height="7" rx="3.5" fill="#BBDEFB" />
            <rect x="30" y="40" width="16" height="7" rx="3.5" fill="#BBDEFB" />
            <path
                d="M 40 52 L 54 66 L 78 34"
                stroke="#FFFFFF"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
        </svg>
    );
}
