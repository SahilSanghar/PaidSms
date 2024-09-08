import React, { useState, useEffect, useRef, Fragment } from "react";
import { Input } from "@/components/ui/Input";

let currentOtpIndex = 0;

const Otp = ({ length = 6, otp, onOtpChange }) => {
  const [tempOtp, setTempOtp] = useState(new Array(length).fill(""));
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);
  const inputRef = useRef(null);

  const handleOnChange = ({ target }) => {
    const { value } = target;
    const newOtp = [...tempOtp];
    newOtp[currentOtpIndex] = value.substring(value.length - 1);

    if (!value) setActiveOtpIndex(currentOtpIndex - 1);
    else setActiveOtpIndex(currentOtpIndex + 1);

    setTempOtp(newOtp);
    const otpValue = newOtp.join("");
    onOtpChange(otpValue); // Ensure the otp value is updated correctly
  };

  const handleOnKeyDown = ({ key }, index) => {
    currentOtpIndex = index;
    if (key === "Backspace") {
      setActiveOtpIndex(currentOtpIndex - 1);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  return (
    <div className="flex items-center space-x-2 w-fit">
      {tempOtp.map((_, index) => (
        <Fragment key={index}>
          <Input
            ref={index === activeOtpIndex ? inputRef : null}
            onChange={handleOnChange}
            onKeyDown={(e) => handleOnKeyDown(e, index)}
            className="w-10 text-center bg-transparent no-arrows"
            type="number"
            value={tempOtp[index]}
          />
        </Fragment>
      ))}
    </div>
  );
};

export default Otp;
