import HexBox from "@src/components/HexBox";

/**
 * L'affichage du processeur à accumulateur
 * @returns Le composant React du processeur à accumulateur
 */
export default function AccumulatorProcessor() {
    return (
        <div className="flex gap-3">
            <div className="bg-[#97fcff] size-min rounded-md">
                <HexBox name="IR" number={0} />
            </div>
            <div className="bg-[#abbde5] size-min rounded-md">
                <HexBox name="PC" number={0} />
            </div>
            <div className="bg-[#97ffc8] size-min rounded-md" >
                <HexBox name="ACC" number={0} defaultBase10={true} />
            </div>
        </div>
    );
}