import React from "react";
import { useAppSelector, useAppDispatch } from "../../hooks/hook";
import { Link } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";

const Navbar = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-white/20 bg-white/10 px-6 py-3 shadow-xl backdrop-blur-lg">
      {/* LEFT GROUP: DP + App Name */}
      <div className="flex items-center gap-4">
        {/* User DP */}
        <div className="h-11 w-11 overflow-hidden rounded-full border-2 border-orange-500 shadow-lg transition-transform hover:scale-105">
          <img
            src={user?.avatar || "https://via.placeholder.com/150"}
            alt="User"
            className="h-full w-full object-cover"
          />
        </div>

        {/* App Name */}
        <Link to="/" className="text-2xl font-black tracking-tight text-white">
          Bistro
          <span className="text-orange-500 underline decoration-2 underline-offset-4">
            App
          </span>
        </Link>
      </div>
      {/* menu itmes */}
      <div className="hidden md:flex items-center gap-8">
        <Link
          to="/menu"
          className="font-medium text-white/80 transition-colors duration-300 hover:text-orange-400"
        >
          Menu
        </Link>
        <Link
          to="/about"
          className="font-medium text-white/80 transition-colors duration-300 hover:text-orange-400"
        >
          About
        </Link>
        <Link
          to="/contact"
          className="font-medium text-white/80 transition-colors duration-300 hover:text-orange-400"
        >
          Contact
        </Link>
      </div>
      {/* RIGHT SIDE: Auth Button */}
      <div>
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <span className="hidden text-sm font-medium text-white/80 italic md:block">
              Welcome, {user?.username}
            </span>
            <button
              onClick={() => dispatch(logout())}
              className="rounded-full border border-white/20 bg-white/10 px-6 py-2 text-xs font-bold text-white transition-all duration-300 hover:border-red-500/50 hover:bg-red-500/40"
            >
              LOGOUT
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="rounded-full bg-orange-500 px-7 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-0.5 hover:bg-orange-600 active:scale-95"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
