import type BoxLinkProps from "@src/interface/BoxLinkProps";
import { Link } from "react-router";

export default function BoxLink ({ nom, url }: BoxLinkProps) {
    return (
        <Link to={ url } className="flex bg-main size-[7rem] justify-center rounded-xl p-3">
            <p className="text-white self-center">{nom}</p>
        </Link>
    );
}