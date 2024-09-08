import { LayoutLoader } from "@/components/layout/Loaders";
import Recharge from "@/pages/Recharge";
import axios from "axios";
import { useEffect, useState } from "react";

const RechargeWrapper = () => {
  const [maintenanceStatusUpi, setMaintenanceStatusUpi] = useState(null);
  const [maintenanceStatusTrx, setMaintenanceStatusTrx] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMaintenanceStatusUpi = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/get-recharge-maintenance?rechargeType=upi`
      );
      setMaintenanceStatusUpi(response.data.maintenance);
    } catch (error) {
      console.error("Error fetching maintenance status:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMaintenanceStatusTrx = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/get-recharge-maintenance?rechargeType=trx`
      );
      setMaintenanceStatusTrx(response.data.maintenance);
    } catch (error) {
      console.error("Error fetching maintenance status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceStatusUpi();
    fetchMaintenanceStatusTrx();
  }, []);

  if (loading) {
    return <LayoutLoader />;
  }

  return (
    <Recharge
      maintenanceStatusTrx={maintenanceStatusTrx}
      maintenanceStatusUpi={maintenanceStatusUpi}
    />
  );
};

export default RechargeWrapper;
