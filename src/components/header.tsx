import { FaPiggyBank } from "react-icons/fa";
import Link from "next/link";

const Header = () => {
  return (
    <header className="justify-betwee fixed top-0 z-50 flex w-full items-center py-4 px-4">
      <div className="container mx-auto">
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
      </div>
    </header>
  );
};

export default Header;
