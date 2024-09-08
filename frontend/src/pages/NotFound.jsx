import React from "react";

const NotFound = () => {
  return (
    <div className="h-[100dvh] flex items-center justify-center relative">
      <h1 className="text-[28px] lg:text-[55px] leading-[30px] lg:leading-[55px] font-[600] lg:font-[500] text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <span className="text-primary">Not</span> Found
      </h1>
    </div>
  );
};

export default NotFound;
