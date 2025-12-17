import Layer1 from "@/components/assets/LooperBG";
import Layer2 from "@/components/assets/Ellipse6";
import Layer3 from "@/components/assets/Ellipse7";
import Layer4 from "@/components/assets/Ellipse8";

export default function SvgStack() {
    return (
        <div className="relative w-full h-full min-h-screen">
            {/* Full screen background */}
            <Layer1 className="absolute inset-0 w-full h-full" />
            <Layer2 className="absolute inset-0 w-full h-full" />

            {/* Positioned layers */}
            <Layer3 className="absolute top-[40%] left-[-7%] w-[35%] h-auto max-h-[90%] md:top-[35%] md:left-[0%] md:w-[40%]" />
            <Layer4 className="absolute bottom-[10%] right-[5%] w-[25%] h-auto max-h-[50%] md:bottom-[5%] md:right-[2%] md:w-[20%]" />
        </div>
    );
}
