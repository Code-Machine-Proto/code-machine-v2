import logo from "@src/assets/code-machine-logo.png";

export default function Header() {
    return (
    <div className="flex h-[5rem] w-full bg-main justify-center items-center gap-5" >
        <img src={ logo } alt="Logo" className="h-[3rem]" />
        <p className="text-white text-xl">Code Machine</p>
    </div>
    );
}