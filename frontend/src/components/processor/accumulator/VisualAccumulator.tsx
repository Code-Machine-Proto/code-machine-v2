import ALU from "../parts/ALU";
import ObscureMemory from "../parts/ObscureMemory";

export default function VisualAccumulator() {

    return(
        <>
        <ObscureMemory name="Mémoire" controlName="wr_mem" className="fill-yellow-200" />
        </>
    );
}