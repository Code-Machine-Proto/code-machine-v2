import logo from "@src/assets/code-machine-logo.png";
import { Link } from "react-router";

/**
 * Composant de l'en-tête qui navigue vers la page
 * d'accueil lors d'un clic sur le logo.
 * 
 * @returns Le composant React du Header
 */
export default function Header() {
    return (
    <div className="flex h-[5rem] bg-main-950 justify-center items-center">
        <Link to="/" className="flex bg-main-950 justify-center items-center gap-5" >
            <img src={ logo } alt="Logo" className="h-[3rem]" />
            <p className="text-white text-xl">Code Machine</p>
        </Link>
    </div>
    );
}
