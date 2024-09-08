import React, { memo, useContext } from "react";
import { LayoutLoader } from "@/components/layout/Loaders";
import Home from "@/pages/Home";
import { AuthContext } from "@/utils/AppContext";

const HomeWrapper = () => {
  const { serviceData, loadingServiceData } = useContext(AuthContext);

  if (loadingServiceData) {
    return <LayoutLoader />;
  }

  return <Home serviceData={serviceData} />;
};

export default memo(HomeWrapper);
