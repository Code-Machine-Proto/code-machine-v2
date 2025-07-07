import BoxLink from "@src/components/BoxLink";

/**
 * Composant de la page principale et permets la navigation entre les différents processeurs
 * 
 * @returns le composant React a affiché
 */
export default function Home() {
    return (
    <div className="bg-back flex grow flex-col gap-5 p-5" >
        <p className="text-white text-4xl">Naviguez les processeurs</p>
        <div className="flex gap-5">
            <BoxLink nom="Accumulateur" url="/processor/accumulator" />
            <BoxLink nom="Accumulateur avec registre MA" url="/processor/with-ma" />
            <BoxLink nom="PolyRisc" url="/processor/polyrisc" />
        </div>
    </div>
    );
}
