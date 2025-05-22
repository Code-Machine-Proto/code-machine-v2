import BoxLink from "@src/components/BoxLink";

export default function Home() {
    return (
    <div className="bg-back flex grow flex-col gap-5 p-5" >
        <p className="text-white text-4xl">Naviguez les processeurs</p>
        <div className="flex gap-5">
            <BoxLink nom="Accumulateur" url="/" />
            <BoxLink nom="Accumulateur avec registre MA" url="/" />
            <BoxLink nom="PolyRisc" url="/" />
        </div>
    </div>
    );
}
