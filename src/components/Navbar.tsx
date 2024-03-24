import Link from "next/link";
import AuthButton from "./AuthButton";
import { ThemeSwitcher } from "./ThemeSwitcher";

const Navbar = () => {
  return (
    <div className="flex w-full shadow-lg">
      <div className="flex items-center justify-between container max-w-6xl w-full p-5">
        <Link href="/" className="text-3xl font-semibold">
          TEST
        </Link>
        <div className="flex items-center gap-2">
          <AuthButton />
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
