import { Link, NavLink } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthProvider";
import Swal from "sweetalert2";
import logo from "/logo.png";
import {
  FaBlog,
  FaFileAlt,
  FaHome,
  FaTachometerAlt,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdFamilyRestroom } from 'react-icons/md';

const Navbar = () => {
  const { user, LogOut } = useContext(AuthContext);

  const handleLogout = () => {
    LogOut()
      .then(() => {
        Swal.fire("Logged Out", "You have been successfully logged out.", "success");
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Error", error.message, "error");
      });
  };

  const navLinks = (
    <>
      <li className="text-white">
        <NavLink to="/" className="font-semibold flex items-center gap-2">
          <FaHome /> Home
        </NavLink>
      </li>
      <li className="text-white">
        <NavLink to="/policies" className="font-semibold flex items-center gap-2">
          <FaFileAlt /> All Policies
        </NavLink>
      </li>
      <li className="text-white">
        <NavLink to="/blogs" className="font-semibold flex items-center gap-2">
          <FaBlog /> Blogs
        </NavLink>
      </li>
      {user && (
        <li className="text-white">
          <NavLink to="/dashboard" className="font-semibold flex items-center gap-2">
            <FaTachometerAlt /> Dashboard
          </NavLink>
        </li>
      )}
    </>
  );

  return (
    <div className="navbar bg-[#1E40AF] shadow-sm fixed top-0 z-50 w-full px-4 lg:px-8">
      {/* Logo Start */}
      <div className="navbar-start">
        <Link to="/" className="flex items-center gap-2">
         <MdFamilyRestroom size={50} className="hidden lg:block md:block" color="white" />
          <span className="text-xl font-bold text-white">Sure Life</span>
        </Link>
      </div>

      {/* Mobile Dropdown */}
      <div className="navbar-end bg-[#1E40AF] lg:hidden">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1000] p-2 shadow bg-[#1E40AF] rounded-box w-52"
          >
            {navLinks}
            {user ? (
              <li>
                <button onClick={handleLogout} className="font-semibold text-white flex items-center gap-2">
                  <FaSignOutAlt /> Logout
                </button>
              </li>
            ) : (
              <li>
                <NavLink to="/login" className="font-semibold text-white flex items-center gap-2">
                  <FaSignInAlt /> Login
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Desktop Center Nav */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          {navLinks}
        </ul>
      </div>

      {/* Desktop End Buttons */}
      <div className="navbar-end hidden lg:flex">
        {user ? (
          <button
            onClick={handleLogout}
            className="btn bg-white text-red-600 hover:bg-red-100 flex items-center gap-2"
          >
            <FaSignOutAlt /> Logout
          </button>
        ) : (
          <NavLink
            to="/login"
            className="btn bg-white text-blue-600 hover:bg-blue-100 flex items-center gap-2"
          >
            <FaSignInAlt /> Login
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Navbar;
