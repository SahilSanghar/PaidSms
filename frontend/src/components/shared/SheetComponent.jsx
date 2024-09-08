import React from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import Logo from "@/assets/Logo-removebg-preview.png";
import { X } from "lucide-react";

const SheetComponent = ({ isOpen, onClose, children, from = "right" }) => {
  if (!isOpen) return null;

  const translateClass =
    from === "right" ? "translate-x-full" : "-translate-x-full";
  const openClass = from === "right" ? "translate-x-0" : "translate-x-0";

  return ReactDOM.createPortal(
    <div
      className={`fixed inset-0 z-[1000] transition-transform transform ${
        isOpen ? openClass : translateClass
      }`}
    >
      <div
        className="fixed inset-0 bg-black/80 transition-opacity z-[999]" // Overlay with transition and z-index
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <div
        className={`fixed ${from}-0 top-0 bottom-0 w-[60%] max-w-sm bg-[#1B1B1B] shadow-lg p-6 z-[1000] transition-transform transform ${
          isOpen ? openClass : translateClass
        }`}
      >
        <Link
          to="/"
          className="absolute left-6 top-6 flex title-font font-medium items-center"
        >
          <img src={Logo} alt="logo" className="w-[100px] md:w-[150px]" />
        </Link>
        {children}
        <button
          className="absolute right-6 top-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>,
    document.body // Render outside of the current DOM hierarchy
  );
};

export default SheetComponent;
