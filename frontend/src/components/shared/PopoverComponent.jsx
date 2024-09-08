import React, { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";

const PopoverComponent = ({
  buttonComponent,
  popoverContent,
  delay = 2000,
  open,
  setOpen,
}) => {
  useEffect(() => {
    let timer;
    if (open) {
      timer = setTimeout(() => {
        setOpen(false);
      }, delay);
    }
    return () => clearTimeout(timer);
  }, [open, delay]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{buttonComponent}</PopoverTrigger>
      <PopoverContent>{popoverContent}</PopoverContent>
    </Popover>
  );
};

export default PopoverComponent;
