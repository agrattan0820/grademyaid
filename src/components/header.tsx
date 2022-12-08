import { FaHeart, FaPiggyBank } from "react-icons/fa";
import Link from "next/link";
import { useSession } from "@supabase/auth-helpers-react";

import Button from "./button";

const Header = () => {
  const session = useSession();

  return (
    <header className="fixed top-0 z-50 w-full bg-emerald-100 py-4 md:bg-transparent">
      <div className="container mx-auto flex items-center justify-between px-4">
        <h1>
          <Link href="/">
            <span className="flex cursor-pointer items-center text-xl md:text-2xl">
              <span className="mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-black text-violet-300">
                <FaPiggyBank />
              </span>
              <span>grademyaid</span>
            </span>
          </Link>
        </h1>
        <div className="flex md:space-x-2">
          {!session ? (
            <>
              <div className="hidden md:block">
                <Link href="/login">
                  <Button color="black" label="Login" outline />
                </Link>
              </div>
              <Link href="/sign-up">
                <Button color="black" label="Sign up" />
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard">
                <Button color="black" label="Dashboard" />
              </Link>
              <div className="hidden md:block">
                <Link href="/dashboard?page=grades">
                  <Button color="black" icon={<FaHeart />} outline />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
