import HexBox from "@src/components/HexBox";

export default function MaProcessor() {
    return (
        <div className="flex gap-3">
            <div className="bg-[#97fcff] size-min rounded-md">
                <HexBox name="IR" number={0} />
            </div>
            <div className="bg-[#abbde5] size-min rounded-md">
                <HexBox name="PC" number={0} />
            </div>
            <div className="bg-[#c2ff97] size-min rounded-md">
                <HexBox name="MA" number={0} />
            </div>
            <div className="bg-[#97ffc8] size-min rounded-md">
                <HexBox name="ACC" number={0} defaultBase10={true} />
            </div>
        </div>
    );
}