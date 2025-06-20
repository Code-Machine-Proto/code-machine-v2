import type BoxLinkProps from "@src/interface/props/BoxLink";
import { Link } from "react-router";

/**
 * Lien en forme de boîte arrondie
 * 
 * @prop nom - Nom du lien pour informer les utilisateurs
 * @prop url - Chemin absolu vers lequel le lien doit pointer
 * @returns Le composant React a inséré dans le DOM
 */
export default function BoxLink ({ nom, url }: BoxLinkProps) {
    return (
        <Link to={ url } className="flex bg-main-950 size-[7rem] justify-center rounded-xl p-3 hover:bg-main-800">
            <p className="text-white self-center">{nom}</p>
        </Link>
    );
}
