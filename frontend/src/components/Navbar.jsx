import { Link } from "react-router";
import {PlusIcon} from "lucide-react";
import { useAuth } from "../context/useAuth";

const Navbar = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-base-300 border-b boder-base-content/10">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary font-mono tracking-tight">
            My Notes
          </h1>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-sm">{user?.email}</span>
            <Link to={"/create"} className="btn btn-primary">
            <PlusIcon className="size-5"/>
            <span>New Note</span>
            </Link>
            <button type="button" className="btn btn-ghost" onClick={signOut}>
              退出
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
