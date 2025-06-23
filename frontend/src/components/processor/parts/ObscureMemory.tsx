import type { ObscureMemoryProps } from "@src/interface/props/ProcessorParts";

/**
 * Affiche une mémoire simple en svg sans texte interne, il faut ajouter les entrées et les sorties
 * @prop children - Les entrées et sorties à ajouter
 * @prop name - Nom de la mémoire
 * @prop controlName - Nom du signal de contrôle
 * @prop className - Style css du rectangle englobant
 * @prop x - la position en x du svg
 * @prop y - la position en y du svg
 * @prop isWritable - si la mémoire peut être écrite dedans
 * @prop hasControlSignal - si la mémoire à un signal de contrôle
 * @returns Affiche le contenant svg de la mémoire
 */
export default function ObscureMemory({ 
    children,
    name,
    controlName,
    className,
    x,
    y,
    isWritable = false,
    hasControlSignal = false,
    }: ObscureMemoryProps) {

    return (
    <svg x={x} y={y} width="95" height="250" viewBox="0 0 170 455" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="170" height="380" className={className} />
        <text x={165} y={20} textAnchor="end" className="fill-black font-bold">{ name }</text>
        { children }
        <path 
            d="M0.134717 333.885C0.410914 333.407 1.0227 333.244 1.50093 333.52L31.5048 350.842L31.5908
            350.897C31.7285 350.996 31.8329 351.127 31.9033 351.272C31.9044 351.274 31.9061 351.276 31.9072
            351.278C32.1658 351.726 32.0381 352.292 31.6269 352.588L31.541 352.643L1.53706 369.966C1.0588
            370.242 0.446956 370.078 0.170849 369.6C-0.105147 369.122 0.0588455 368.51 0.53706 368.234L29.082
            351.753L0.500928 335.251C0.0227847 334.975 -0.141388 334.363 0.134717 333.885Z" 
            fill="black"
        />
        {
            hasControlSignal &&
            <>
            <path 
                d="M85 380L70.5662 405H99.4338L85 380ZM85 455H87.5V402.5H85H82.5V455H85Z"
                className={ isWritable ? "fill-main-500" : "fill-white" }
            />
            <text x={90} y={450} className="fill-white">{ controlName }</text>
            </>
        }
    </svg>
    );
}
