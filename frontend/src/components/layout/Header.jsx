import Logo from "@/assets/Logo-removebg-preview.png";
import { cn } from "@/lib/utils";
import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";
import { Icon } from "../ui/Icons";
import { AuthContext } from "@/utils/AppContext";

import SheetComponent from "../shared/SheetComponent";

const Header = () => {
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenlogin, setIsOpenlogin] = useState(false);

  const toggleSheet = () => {
    setIsOpen(!isOpen);
  };
  const toggleSheetLogin = () => {
    setIsOpenlogin(!isOpenlogin);
  };

  const links = [
    { to: "/", text: "Home" },
    { to: "/recharge", text: "Recharge" },
    { to: "/history", text: "History" },
    { to: "http://t.me/paidsms_support", text: "Contact Us" },
    { to: "/about", text: "About" },
    { to: "https://t.me/paidsms_official", text: "Join Channel" },
    { to: "/my-orders", text: "My Orders" },
    { to: "/api", text: "Api" },
    { to: "/check-otp", text: "Check Otp" },
  ];

  const logoutlinks = [
    { to: "/", text: "Home" },
    { to: "/login", text: "Log-in" },
    { to: "/signup", text: "Sign Up" },
    { to: "http://t.me/paidsms_support", text: "Contact Us" },
    { to: "https://t.me/paidsms_official", text: "Join Channel" },
    { to: "/about", text: "About" },
  ];

  const { user, logout, balance, isGoogleLogin } = useContext(AuthContext);

  const handleToggleDropdown = () => {
    setToggleDropdown((prev) => !prev);
  };

  const navigateToChangePassword = () => navigate("/change-password");

  const wrapStyle = {
    wordBreak: "break-word",
    whiteSpace: "normal",
    overflowWrap: "break-word",
  };

  return (
    <header className="top-0 inset-x-0 h-[4rem] py-4 sticky bg-black lg:py-2">
      <div className="md:container px-[1rem] h-full mx-auto flex items-center justify-between gap-2">
        <Link
          to="/"
          className="hidden lg:flex title-font font-medium items-center"
        >
          <img src={Logo} alt="logo" className="w-[100px] md:w-[150px]" />
        </Link>
        {!user ? (
          <>
            <nav className="hidden lg:flex gap-10 flex-wrap items-center pl-10 text-base justify-center">
              {logoutlinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.to}
                  className={`group font-normal text-lg text-secondary transition-colors duration-200 ease-in-out ${
                    pathname === link.to
                      ? "!text-primary"
                      : "hover:text-primary"
                  }`}
                >
                  {link.text}
                  <span
                    className={`block h-[2px] bg-primary transition-all duration-300 ease-in-out transform ${
                      pathname === link.to
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              ))}
            </nav>
            <div>
              {/* <SheetTrigger asChild> */}
              <Button
                variant="login"
                onClick={toggleSheet}
                className="w-fit p-0 bg-transparent hover:bg-transparent m-0 lg:hidden inline-block"
              >
                <Icon.menu className="text-primary" />
              </Button>
              {/* </SheetTrigger> */}
              <SheetComponent
                className="dark w-[60%] border-none bg-[#1B1B1B]"
                // side={"left"}
                isOpen={isOpen}
                onClose={toggleSheet}
                from="left"
              >
                {/* <SheetHeader className={"hidden"}>
                  <SheetTitle>Navigation Sidebar</SheetTitle>
                  <SheetDescription>
                    This is for mobile view navigation.
                  </SheetDescription>
                </SheetHeader> */}
                <nav className="flex gap-6 flex-wrap flex-col items-start text-base pt-[4rem]">
                  <Link
                    to="/"
                    className={`flex gap-2 w-full items-center font-normal text-[#9E9E9E] transition-colors duration-200 ease-in-out ${
                      pathname === "/" ? "!text-primary" : "hover:text-primary"
                    }`}
                  >
                    <Icon.home className="w-4 h-4 text-primary" />
                    Home
                  </Link>
                  <Link
                    to="http://t.me/paidsms_support"
                    className={`flex gap-2 w-full items-center font-normal text-[#9E9E9E] transition-colors duration-200 ease-in-out ${
                      pathname === "/contact"
                        ? "!text-primary"
                        : "hover:text-primary"
                    }`}
                  >
                    <Icon.contact className="w-4 h-4 text-primary" />
                    Contact Us
                  </Link>
                  <Link
                    to="https://t.me/paidsms_official"
                    className={`flex gap-2 w-full items-center font-normal text-[#9E9E9E] transition-colors duration-200 ease-in-out ${
                      pathname === "/channel"
                        ? "!text-primary"
                        : "hover:text-primary"
                    }`}
                  >
                    <Icon.joinChannel className="w-4 h-4 text-primary" />
                    Join Channel
                  </Link>
                  <Link
                    to="/about"
                    className={`flex gap-2 w-full items-center font-normal text-[#9E9E9E] transition-colors duration-200 ease-in-out ${
                      pathname === "/about"
                        ? "!text-primary"
                        : "hover:text-primary"
                    }`}
                  >
                    <Icon.info className="w-4 h-4 text-primary" />
                    About
                  </Link>

                  <Link
                    to="/login"
                    className={`flex gap-2 w-full items-center font-normal text-[#9E9E9E] transition-colors duration-200 ease-in-out ${
                      pathname === "/login"
                        ? "!text-primary"
                        : "hover:text-primary"
                    }`}
                  >
                    <Icon.login className="w-4 h-4 text-primary" />
                    Log-in
                  </Link>
                  <Link
                    to="/signup"
                    className={`flex gap-2 w-full items-center font-normal text-[#9E9E9E] transition-colors duration-200 ease-in-out ${
                      pathname === "/signup"
                        ? "!text-primary"
                        : "hover:text-primary"
                    }`}
                  >
                    <Icon.signup className="w-4 h-4 text-primary" />
                    Sign-up
                  </Link>
                </nav>
              </SheetComponent>
            </div>
          </>
        ) : (
          <>
            <nav className="hidden lg:flex gap-8 flex-wrap items-center text-base justify-center">
              {links.map((link, index) => (
                <Link
                  key={index}
                  to={link.to}
                  className={`group font-normal text-lg text-secondary transition-colors duration-200 ease-in-out ${
                    pathname === link.to
                      ? "!text-primary"
                      : "hover:text-primary"
                  }`}
                >
                  {link.text}
                  <span
                    className={`block h-[2px] bg-primary transition-all duration-300 ease-in-out transform ${
                      pathname === link.to
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              ))}
            </nav>

            <div className="inline-flex lg:hidden items-center gap-2 border-0  justify-between w-full">
              <Button
                variant="login"
                onClick={toggleSheetLogin}
                className="w-fit p-0 bg-transparent hover:bg-transparent m-0 lg:hidden inline-block"
              >
                <Icon.menu className="text-primary" />
              </Button>
              {/* </SheetTrigger> */}
              <SheetComponent
                className="dark w-[60%] border-none bg-[#1B1B1B]"
                // side={"left"}
                isOpen={isOpenlogin}
                onClose={toggleSheetLogin}
                from="left"
              >
                {/* <SheetHeader className={"hidden"}>
                  <SheetTitle>Navigation Sidebar</SheetTitle>
                  <SheetDescription>
                    This is for mobile view navigation.
                  </SheetDescription>
                </SheetHeader> */}
                <nav className="flex gap-6 flex-wrap flex-col items-start text-base pt-[4rem]">
                  <hr className="border border-[#585858] my-1 w-full" />
                  <Link
                    to="/"
                    className={`flex gap-2 w-full items-center font-normal text-[#9E9E9E] transition-colors duration-200 ease-in-out ${
                      pathname === "/" ? "!text-primary" : "hover:text-primary"
                    }`}
                  >
                    <Icon.home className="w-4 h-4 text-primary" />
                    Home
                  </Link>
                  <Link
                    to="/recharge"
                    className={`flex gap-2 w-full items-center font-normal text-[#9E9E9E] transition-colors duration-200 ease-in-out ${
                      pathname === "/recharge"
                        ? "!text-primary"
                        : "hover:text-primary"
                    }`}
                  >
                    <Icon.recharge className="w-4 h-4 text-primary" />
                    Recharge
                  </Link>
                  <Link
                    to="/history"
                    className={`flex gap-2 w-full items-center font-normal text-[#9E9E9E] transition-colors duration-200 ease-in-out ${
                      pathname === "/history"
                        ? "!text-primary"
                        : "hover:text-primary"
                    }`}
                  >
                    <Icon.history className="w-4 h-4 text-primary" />
                    History
                  </Link>
                  <Link
                    to="http://t.me/paidsms_support"
                    className={`flex gap-2 w-full items-center font-normal text-[#9E9E9E] transition-colors duration-200 ease-in-out ${
                      pathname === "/contact"
                        ? "!text-primary"
                        : "hover:text-primary"
                    }`}
                  >
                    <Icon.contact className="w-4 h-4 text-primary" />
                    Contact Us
                  </Link>
                  <Link
                    to="https://t.me/paidsms_official"
                    className={`flex gap-2 w-full items-center font-normal text-[#9E9E9E] transition-colors duration-200 ease-in-out ${
                      pathname === "/channel"
                        ? "!text-primary"
                        : "hover:text-primary"
                    }`}
                  >
                    <Icon.joinChannel className="w-4 h-4 text-primary fill-primary" />
                    Join Channel
                  </Link>
                  <Link
                    to="/my-orders"
                    className={`flex gap-2 w-full items-center font-normal text-[#9E9E9E] transition-colors duration-200 ease-in-out ${
                      pathname === "/my-orders"
                        ? "!text-primary"
                        : "hover:text-primary"
                    }`}
                  >
                    <Icon.order className="w-4 h-4 text-primary" />
                    My Orders
                  </Link>
                  <Link
                    to="/api"
                    className={`flex gap-2 w-full items-center font-normal text-[#9E9E9E] transition-colors duration-200 ease-in-out ${
                      pathname === "/api"
                        ? "!text-primary"
                        : "hover:text-primary"
                    }`}
                  >
                    <Icon.api className="w-4 h-4 text-primary" />
                    Api
                  </Link>
                  <Link
                    to="/check-otp"
                    className={`flex gap-2 w-full items-center font-normal text-[#9E9E9E] transition-colors duration-200 ease-in-out ${
                      pathname === "/check-otp"
                        ? "!text-primary"
                        : "hover:text-primary"
                    }`}
                  >
                    <Icon.checkOtp className="w-4 h-4 text-primary" />
                    Check otp
                  </Link>
                  <Link
                    to="/about"
                    className={`flex gap-2 w-full items-center font-normal text-[#9E9E9E] transition-colors duration-200 ease-in-out ${
                      pathname === "/about"
                        ? "!text-primary"
                        : "hover:text-primary"
                    }`}
                  >
                    <Icon.info className="w-4 h-4 text-primary" />
                    About
                  </Link>
                </nav>
              </SheetComponent>
              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-full border-primary border-2 p-1">
                  <Icon.indianRupee className="w-3 h-3" />
                  <p className="text-xs">{balance || "0"}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="py-0 px-2 !text-[18px] font-normal rounded-full hover:text-primary focus:outline-none ease-in-out !bg-transparent"
                      onClick={handleToggleDropdown}
                    >
                      <Icon.userAvatar className="w-7 h-7 text-primary" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 flex lg:hidden flex-col p-3 !bg-[#1e1e1e] text-white border-none font-light"
                    align="end"
                  >
                    <DropdownMenuLabel style={wrapStyle}>
                      {user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className={`w-full ${isGoogleLogin ? "hidden" : ""}`}
                      onClick={navigateToChangePassword}
                    >
                      <Icon.setting className="mr-4 h-5 w-5" />
                      <span>Change password</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="w-full" onClick={logout}>
                      <Icon.logOut className="mr-4 h-5 w-5" />
                      <span>Log-out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </>
        )}
        <div className="hidden lg:inline-flex items-center gap-2 border-0 py-1 px-2 lg:py-1 lg:px-3 ">
          {user ? (
            <div className="flex items-center">
              <Icon.wallet className="w-6 h-6" />
              <p className="pl-2">{balance || "0"}</p>
              <Icon.indianRupee className="w-4 h-4" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="py-0 px-0 ml-5 !text-[18px] font-normal rounded-full hover:text-primary focus:outline-none ease-in-out !bg-transparent"
                    onClick={handleToggleDropdown}
                  >
                    <Icon.userAvatar className="w-6 h-6" />
                    <Icon.arrowUp
                      className={cn(
                        toggleDropdown ? "rotate-180" : "rotate-180",
                        "w-5 h-5 transition-transform duration-150"
                      )}
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 hidden lg:flex flex-col p-3 !bg-[#1e1e1e] text-white border-none font-light"
                  align="end"
                >
                  <DropdownMenuLabel style={wrapStyle}>
                    {user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className={`w-full ${isGoogleLogin ? "hidden" : ""}`}
                    onClick={navigateToChangePassword}
                  >
                    <Icon.setting className="mr-4 h-5 w-5" />
                    <span>Change password</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="w-full" onClick={logout}>
                    <Icon.logOut className="mr-4 h-5 w-5" />
                    <span>Log-out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Header;
