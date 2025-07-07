import React from 'react';
import { NavLink } from 'react-router'; 
import logo from '/logo.png'; 

const Navbar = () => {
  const navLinks = (
    <>
      <li><NavLink to="/" className="font-semibold">Home</NavLink></li>
      <li><NavLink to="/policies" className="font-semibold">All Policies</NavLink></li>
      <li><NavLink to="/agents" className="font-semibold">Agents</NavLink></li>
      <li><NavLink to="/faq" className="font-semibold">FAQs</NavLink></li>
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-sm fixed top-0 left-0 right-0 z-50">
      {/* Left - Logo */}
      <div className="navbar-start">
        <NavLink to="/" className="btn btn-ghost normal-case text-xl flex items-center gap-2">
          <img src={logo} alt="LifeSure Logo" className="w-8 h-8" />
          <span className="font-bold hidden sm:inline">LifeSure</span>
        </NavLink>
      </div>

      {/* Center - Menu (for large screen) */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {navLinks}
        </ul>
      </div>

      {/* Right - Login Button */}
      <div className="navbar-end hidden lg:flex">
        <NavLink to="/login" className="btn btn-outline btn-primary">
          Login
        </NavLink>
      </div>

      {/* Mobile Dropdown */}
      <div className="navbar-end lg:hidden">
        <div className="dropdown dropdown-end">
          <button tabIndex={0} className="btn btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <ul tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            {navLinks}
            <li><NavLink to="/login" className="font-semibold">Login</NavLink></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
