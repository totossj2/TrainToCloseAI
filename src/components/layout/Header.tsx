import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Menu, X, Mic } from "lucide-react";
import { Link as ScrollLink, Link } from "react-scroll";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-gray-900 opacity-90 shadow-md py-3  "
          : "bg-transparent py-5 border-none"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link
            to="hero"
            smooth={true}
            duration={800}
            offset={-100}
            className="flex cursor-pointer items-center space-x-2"
          >
            <Mic className="h-8 w-8 text-white" />
            <span className={`text-xl font-bold text-white`}>
              Train To Close
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            <>
              <ScrollLink
                to="problem"
                smooth={true}
                duration={800}
                offset={-100}
                className={`cursor-pointer transition-colors text-white hover:text-teal-500`}
              >
                Problem
              </ScrollLink>

              <ScrollLink
                to="how-it-works"
                smooth={true}
                duration={800}
                offset={-100}
                className={`cursor-pointer transition-colors text-white hover:text-teal-500`}
              >
                How it works
              </ScrollLink>
              <ScrollLink
                to="waitlist"
                smooth={true}
                duration={800}
                offset={-100}
                className="px-4 py-2 rounded-lg cursor-pointer bg-teal-500 text-white font-semibold hover:bg-teal-600 transition-colors"
              >
                Join Early Access
              </ScrollLink>
            </>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden ${
              isScrolled ? "text-indigo-900" : "text-white"
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className={`md:hidden absolute top-full left-0 w-full py-4 px-4 animate-fadeIn ${
              isScrolled
                ? "bg-gray-900 opacity-100 shadow-lg"
                : "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
            }`}
          >
            <nav className="flex flex-col space-y-4">
              <ScrollLink
                to="problem"
                smooth={true}
                duration={800}
                offset={-100}
                className={`cursor-pointer transition-colors ${
                  isScrolled
                    ? "text-white hover:text-indigo-900"
                    : "text-white hover:text-gray-200"
                }`}
              >
                Problem
              </ScrollLink>
              <ScrollLink
                to="how-it-works"
                smooth={true}
                duration={800}
                offset={-100}
                className={`cursor-pointer transition-colors ${
                  isScrolled
                    ? "text-white hover:text-indigo-900"
                    : "text-white hover:text-gray-200"
                }`}
              >
                How it works
              </ScrollLink>

              <ScrollLink
                to="waitlist"
                smooth={true}
                duration={800}
                offset={-100}
                className="px-4 py-2 w-fit rounded-lg cursor-pointer bg-teal-500 text-white font-semibold hover:bg-teal-600 transition-colors"
              >
                Join Early Access
              </ScrollLink>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
