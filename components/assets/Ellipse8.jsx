// components/assets/Ellipse8.jsx
export default function Ellipse8({ width = 467, height = 467, style, ...props }) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 713 563"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={style}
            {...props}
        >
            <g opacity="0.2" filter="url(#filter0_f_6_167)">
                <path
                    d="M717 483.5C717 612.458 612.458 717 483.5 717C354.542 717 250 612.458 250 483.5C250 354.542 354.542 250 483.5 250C612.458 250 717 354.542 717 483.5Z"
                    fill="#5D6EF3"
                />
            </g>
            <defs>
                <filter
                    id="filter0_f_6_167"
                    x="0"
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
                        result="effect1_foregroundBlur_6_167"
                    />
                </filter>
            </defs>
        </svg>
    );
}
