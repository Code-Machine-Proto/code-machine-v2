import logo from "@src/assets/code-machine-logo.png";
import { Link } from "react-router";

export default function Header() {
    return (
    <Link to="/" className="flex h-[5rem] w-full bg-main-950 justify-center items-center gap-5" >
        <img src={ logo } alt="Logo" className="h-[3rem]" />
        <p className="text-white text-xl">Code Machine</p>
    </Link>
    );
}