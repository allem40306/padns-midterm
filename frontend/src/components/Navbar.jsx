// https://tailwindui.com/components/application-ui/navigation/navbars
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import services from "../services";

function Navbar() {
  // const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [isLoggin, setLoggin] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();
  // const switchUserMenuOpen = () => setUserMenuOpen((prev) => !prev);
  const switchMobileMenuOpen = () => setMobileMenuOpen((prev) => !prev);
  const linkClass = (to) =>
    pathname === to
      ? "bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
      : "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium";
  const mobileLinkClass = (to) =>
    pathname === to
      ? "bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium"
      : "text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium";

  useEffect(() => {
    console.log("update Navbar");
    console.log(process.env.NODE_ENV)
    services.auth.loginCheck().then((res) => {
      setLoggin(res.data.loggedIn);
    });
  }, [isLoggin]);

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* {<!-- Mobile menu button-->} */}
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={switchMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>

              {/* {`Icon when menu is open.
                Heroicon name: outline/x
                Menu open: "block", Menu closed: "hidden"

                Icon when menu is closed.
                Heroicon name: outline/menu
                Menu open: "hidden", Menu closed: "block"`} */}
              {isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/">
                <img
                  className="block lg:hidden h-8 w-auto"
                  src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                  alt="Workflow"
                />
                <img
                  className="hidden lg:block h-8 w-auto"
                  src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
                  alt="Workflow"
                />
              </Link>
            </div>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                {/* {<!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->} */}
                <Link to="/" className={linkClass("/")}>
                  Info
                </Link>
                <Link to="/team" className={linkClass("/chat")}>
                  Chat
                </Link>
                {isLoggin ? (
                  <>
                    <Link to="/logout" className={linkClass("/logout")}>
                      Logout
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/login" className={linkClass("/login")}>
                      Login
                    </Link>
                    <Link to="/signup" className={linkClass("/signup")}>
                      Signup
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* {<!-- Mobile menu, show/hide based on menu state. -->} */}
      <div
        className={"sm:hidden " + (isMobileMenuOpen ? "" : "hidden")}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {/* {<!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->} */}
          <Link to="/dashboard" className={mobileLinkClass("/dashboard")}>
            Dashboard
          </Link>
          <Link to="/team" className={mobileLinkClass("/team")}>
            Team
          </Link>
          <Link to="/login" className={mobileLinkClass("/login")}>
            Login
          </Link>
          <Link to="/signup" className={mobileLinkClass("/signup")}>
            Signup
          </Link>
          <Link to="/users" className={mobileLinkClass("/users")}>
            Users
          </Link>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
