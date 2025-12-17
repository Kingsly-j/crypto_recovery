// components/assets/Ellipse7.jsx
export default function Ellipse7({ width = 457, height = 467, style, ...props }) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 596 910"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={style}
            {...props}
        >
            <g opacity="0.2" filter="url(#filter0_f_6_166)">
                <path
                    d="M346 483.5C346 612.458 241.458 717 112.5 717C-16.4585 717 -121 612.458 -121 483.5C-121 354.542 -16.4585 250 112.5 250C241.458 250 346 354.542 346 483.5Z"
                    fill="#5D6EF3"
                />
            </g>
            <defs>
                <filter
                    id="filter0_f_6_166"
                    x="-371"
                    y="0"
                    width="967"
                    height="967"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                    />
                    <feGaussianBlur
                        stdDeviation="125"
                        result="effect1_foregroundBlur_6_166"
                    />
                </filter>
            </defs>
        </svg>
    );
}
