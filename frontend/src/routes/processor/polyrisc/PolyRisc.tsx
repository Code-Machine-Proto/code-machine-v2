import HexBox from "@src/components/HexBox";

export default function PolyRiscProcessor() {
    return (
        <div className="flex gap-3">
            <div className="bg-[#97fcff] size-min rounded-md">
                <HexBox name="IR" number={0} />
            </div>
            <div className="bg-[#abbde5] size-min rounded-md">
                <HexBox name="PC" number={0} />
            </div>
        </div>
    );
}