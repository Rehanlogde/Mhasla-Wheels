import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { customer, logout } = useAuth();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Fleet", path: "/fleet" },
    { name: "Contact", path: "/contact" },
    { name: "Admin", path: "/admin" }
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  const displayName =
    customer?.name ||
    (customer?.email ? customer.email.split("@")[0] : "User");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinkClass = (path: string) =>
    `relative text-[14px] font-bold uppercase tracking-widest transition-all duration-300 ${isActive(path)
      ? "text-red-500"
      : "text-white/80 hover:text-white"
    }`;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
            ? "backdrop-blur-xl bg-black/80 shadow-2xl border-b border-red-900/40 py-2"
            : "bg-transparent py-4"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20 md:h-24">
            
            {/* Logo Section - FIXED BORDER RADIUS */}
            <Link
              to="/"
              className="flex items-center gap-3 group transition-transform hover:scale-105"
            >
              <div className="relative w-14 h-14 md:w-20 md:h-20 flex-shrink-0">
                <div className="absolute inset-0 bg-red-600/30 blur-xl rounded-full group-hover:bg-red-600/50 transition-colors" />
                <div className="relative w-full h-full rounded-full border-2 border-red-600/50 p-1 bg-white overflow-hidden shadow-[0_0_15px_rgba(255,0,0,0.3)]">
                  <img
                    src="/splash-logo.png"
                    alt="Mhasla Wheels"
                    className="w-full h-full object-cover rounded-full" 
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-2xl font-black tracking-tighter text-white leading-none">
                  MHASLA <span className="text-red-600">WHEELS</span>
                </span>
                <span className="text-[10px] text-gray-400 tracking-[0.2em] font-bold uppercase">Premium Car Rental</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <Link key={item.name} to={item.path} className={navLinkClass(item.path)}>
                  {item.name}
                </Link>
              ))}
              
              <div className="h-6 w-[1px] bg-gray-800 mx-2" />

              {customer ? (
                <div className="flex items-center gap-6">
                  <Link to="/profile" className="text-sm font-bold text-gray-300 hover:text-red-400 transition-colors">
                    HI, {displayName.toUpperCase()}
                  </Link>
                  <Button variant="ghost" onClick={handleLogout} className="text-white/50 hover:text-red-500 hover:bg-transparent px-0 uppercase text-lg tracking-tighter">
                    Logout
                  </Button>
                </div>
              ) : (
                <Link to="/login" className="text-sm font-bold text-white hover:text-red-500 transition-colors">
                  LOGIN
                </Link>
              )}

              <Button asChild className="rounded-full bg-red-600 hover:bg-red-700 px-8 shadow-lg shadow-red-600/20">
                <Link to="/booking">BOOK NOW</Link>
              </Button>
            </nav>

            {/* Mobile Toggle */}
            <button
              className="lg:hidden text-white p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={30} /> : <Menu size={30} />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-out Menu */}
        <div className={`lg:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-2xl border-b border-red-900/50 transition-all duration-500 ease-in-out overflow-hidden ${isMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"}`}>
          <nav className="flex flex-col p-8 space-y-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-2xl font-black uppercase tracking-tighter text-white/90 hover:text-red-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <hr className="border-gray-800" />
            {!customer ? (
               <Link to="/login" className="text-xl font-bold text-red-500" onClick={() => setIsMenuOpen(false)}>LOGIN / REGISTER</Link>
            ) : (
              <Link to="/profile" className="text-xl font-bold text-red-500" onClick={() => setIsMenuOpen(false)}>MY PROFILE</Link>
            )}
            <Button asChild size="lg" className="w-full bg-red-600 text-lg font-bold">
               <Link to="/booking" onClick={() => setIsMenuOpen(false)}>BOOK YOUR RIDE</Link>
            </Button>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;