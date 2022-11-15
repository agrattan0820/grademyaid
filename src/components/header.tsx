import { FaPiggyBank } from "react-icons/fa";
import Link from "next/link";
import Button from "./button";

const Header = () => {
  return (
    <header className="fixed top-0 z-50 w-full py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        <h1>
          <Link href="/marketing">
            <span className="flex cursor-pointer items-center text-2xl">
              <span className="mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-black text-violet-300">
                <FaPiggyBank />
              </span>
              <span>grademyaid</span>
            </span>
          </Link>
        </h1>
        <div className="flex space-x-2">
          <Button color="black" label="Login" outline />
          <Button color="black" label="Sign up" />
        </div>
      </div>
    </header>
  );
};

export default Header;
