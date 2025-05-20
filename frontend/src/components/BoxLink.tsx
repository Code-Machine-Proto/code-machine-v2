import type BoxLinkProps from "@src/interface/BoxLinkProps";
import { Link } from "react-router";

export default function BoxLink ({ nom, url }: BoxLinkProps) {
    return (
        <Link to={ url } className="text-white bg-main p-[2rem] rounded-xl size-fit">
            { nom }
        </Link>
    );
}