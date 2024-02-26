import Link from "next/link";
import AuthButton from "./AuthButton";

const Navbar = () => {
  return (
    <div className="flex w-full bg-sky-200 shadow-md">
      <div className="flex items-center justify-between container max-w-6xl w-full p-5">
        <Link href="/" className="text-3xl font-semibold">
          TEST
        </Link>
        <div>
          <AuthButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
