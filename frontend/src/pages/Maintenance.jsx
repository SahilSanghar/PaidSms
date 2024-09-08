import React from "react";
import bgImage from "../assets/maintenance.png";

const Maintenance = () => {
  return (
    <div className="h-[100dvh] flex flex-col gap-4 items-center justify-center relative container">
      <h1 className="absolute top-0 left-0 m-4 text-xl font-extrabold text-primary">
        Maintenance
      </h1>

      <img src={bgImage} alt="" />
      <h1 className="text-[28px] lg:text-[55px] leading-[30px] lg:leading-[55px] font-[600] lg:font-[500] text-center">
        <span className="text-primary">Site</span> Under Maintenance
      </h1>
    </div>
  );
};

export default Maintenance;
