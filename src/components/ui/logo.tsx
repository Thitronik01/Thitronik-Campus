import { cn } from "@/lib/utils";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
    variant?: "default" | "dark";
}

export function Logo({ className, variant = "default", ...props }: LogoProps) {
    const textColor = variant === "default" ? "#FFFFFF" : "#1D3661";

    return (
        <svg
            viewBox="0 0 450 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("h-8 w-auto", className)}
            {...props}
        >
            {/* THITRONIK Red Abstract Emblem */}
            <path
                d="M25 60 L60 60 L75 18 C65 35 45 50 25 60 Z"
                fill="#D30024"
            />
            <path
                d="M66 60 L90 60 L85 18 C80 35 72 50 66 60 Z"
                fill="#D30024"
            />

            {/* THITRONIK Text - ViewBox expanded to 450 to fit the "K" */}
            <text
                x="105"
                y="60"
                fontFamily="Arial, system-ui, sans-serif"
                fontWeight="900"
                fontSize="54"
                fill={textColor}
                letterSpacing="0"
            >
                THITRONIK
            </text>
        </svg>
    );
}
