import { Link, NavLink } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthProvider";
import Swal from "sweetalert2";
import logo from '/logo.png'

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
      <li><NavLink to="/" className="font-semibold">Home</NavLink></li>
      <li><NavLink to="/policies" className="font-semibold">All Policies</NavLink></li>
      <li><NavLink to="/agents" className="font-semibold">Agent</NavLink></li>
      <li><NavLink to="/faq" className="font-semibold">FAQ</NavLink></li>


      {
        user && <>
        
        <li><NavLink to="/dashboard" className="font-semibold">Dashboard</NavLink></li>
        
        </>
      }

    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-md px-4">
      {/* Logo */}
      <div className="navbar-start">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="logo" className="w-10 h-10" />
          <span className="text-xl font-bold text-primary">LifeSure</span>
        </Link>
      </div>

      {/* Mobile Dropdown */}
      <div className="navbar-center lg:hidden">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            {navLinks}
            {
              user ? (
                <li>
                  <button onClick={handleLogout} className="font-semibold w-full text-left">
                    Logout
                  </button>
                </li>
              ) : (
                <li>
                  <NavLink to="/login" className="font-semibold">Login</NavLink>
                </li>
              )
            }
          </ul>
        </div>
      </div>

      {/* Desktop Menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          {navLinks}
        </ul>
      </div>

      {/* Desktop End */}
      <div className="navbar-end hidden lg:flex">
        {
          user ? (
            <button onClick={handleLogout} className="btn btn-outline btn-error">
              Logout
            </button>
          ) : (
            <NavLink to="/login" className="btn btn-outline btn-primary">
              Login
            </NavLink>
          )
        }
      </div>
    </div>
  );
};

export default Navbar;
