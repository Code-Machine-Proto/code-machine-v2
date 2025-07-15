import logo from "@src/assets/code-machine-logo.png";
import arrow from "@src/assets/arrow.svg";
import { Link, useLocation } from "react-router";

/**
 * Composant de l'en-tête qui navigue vers la page
 * d'accueil lors d'un clic sur le logo.
 * 
 * @returns Le composant React du Header
 */
export default function Header() {
    const pathName = useLocation().pathname;
    return (
    <header className="flex h-[5rem] bg-main-950 justify-center items-center gap-3" >
        <Link to="/" className="flex bg-main-950 justify-center items-center gap-5" >
            {
                pathName !== '/' &&
                <img src={ arrow } alt="back arrow" className="size-[1rem]" />
            }
            <img src={ logo } alt="Logo" className="h-[3rem]" />
            <p className="text-white text-xl">Code Machine</p>
        </Link>
        <p className="text-white text-sm" >
            v{__APP_VERSION__}
        </p>
    </header>
    );
}
