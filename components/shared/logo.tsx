import logo from "../../public/images/logos/palnect-bar-indigo.png";
import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <>
      <Link href={"/"} className="flex items-center">
        <Image className="w-20 z-10" src={logo} alt="logo"/>
        <Image className="w-16 hidden md:flex dark:hidden" src={logo} alt="logo"/>
        <Image className="w-8 md:hidden flex" src={logo} alt="mlogo"/>
      </Link>
    </>
  );
}