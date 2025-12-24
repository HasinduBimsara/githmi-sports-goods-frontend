import { useState } from "react";
import { BsCart4 } from "react-icons/bs";
import { RxHamburgerMenu } from "react-icons/rx";
import { Link, useLocation } from "react-router-dom"; // ADD useLocation
import UserData from "./userData";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // ADD THIS

  // Helper function to check active link
  const isActive = (path) => {
    return location.pathname === path
      ? "text-blue-600 font-semibold"
      : "text-accent";
  };

  return (
    <header className="h-[70px] w-full flex justify-start items-center bg-gray-100 relative">
      <RxHamburgerMenu
        className="lg:hidden text-3xl text-accent mx-4"
        onClick={() => {
          setIsOpen(true);
        }}
      />
      <div className="hidden lg:flex w-[500px] h-full items-center justify-evenly text-xl">
        {/* UPDATE THESE LINKS WITH ACTIVE CLASS */}
        <Link to="/" className={isActive("/")}>
          Home
        </Link>
        <Link to="/products" className={isActive("/products")}>
          Products
        </Link>
        <Link to="/contact" className={isActive("/contact")}>
          Contact us
        </Link>
        <Link to="/reviews" className={isActive("/reviews")}>
          Reviews
        </Link>

        <div className="absolute right-[70px] h-full">
          <UserData />
        </div>

        <Link to="/cart" className="absolute right-[30px] text-3xl text-accent">
          <BsCart4 />
        </Link>
      </div>
      {isOpen && (
        <div className="fixed lg:hidden z-[9999] top-0 left-0 bg-[#00000060] w-full h-screen flex">
          <div className="w-[300px] h-full bg-white flex flex-col justify-start items-start p-4">
            <RxHamburgerMenu
              className="text-3xl text-accent"
              onClick={() => setIsOpen(false)}
            />
            {/* UPDATE MOBILE LINKS TOO */}
            <Link to="/" className={`text-xl my-4 ${isActive("/")}`}>
              Home
            </Link>
            <Link
              to="/products"
              className={`text-xl my-4 ${isActive("/products")}`}
            >
              Products
            </Link>
            <Link
              to="/contact"
              className={`text-xl my-4 ${isActive("/contact")}`}
            >
              Contact us
            </Link>
            <Link
              to="/reviews"
              className={`text-xl my-4 ${isActive("/reviews")}`}
            >
              Reviews
            </Link>
            <Link to="/cart" className={`text-xl my-4 ${isActive("/cart")}`}>
              Cart
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
