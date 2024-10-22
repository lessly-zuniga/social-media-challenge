"use client";
import Image from "next/image";
import { useAuth } from "../hooks/useAuth";

interface NavbarProps {
  onNewPost: () => void;
  onProfile: (userId: string) => void;
}

export default function Navbar({ onNewPost, onProfile }: NavbarProps) {
  const { user, signOut } = useAuth();
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <div
        className="flex items-center gap-4 cursor-pointer"
        onClick={() => onProfile(user?.uid || "")}
      >
        {user?.photoURL && (
          <Image
            src={user.photoURL}
            alt={user?.displayName || "User Avatar"}
            className="rounded-full mr-2"
            width={32}
            height={32}
          />
        )}
        <p className="text-lg font-semibold">
          {user?.displayName || "Anonymous"}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={onNewPost}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
        >
          +
        </button>
        <button
          onClick={handleLogout}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
