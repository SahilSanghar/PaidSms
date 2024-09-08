import React, { useState, useEffect, useContext } from "react";
import AppLayout from "./../components/layout/AppLayout";
import { Icon } from "@/components/ui/Icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/utils/AppContext";
import toast from "react-hot-toast";

const Home = ({ serviceData }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, apiKey, fetchBalance } = useContext(AuthContext);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
    setSelectedService(null);
  };

  const handleServiceClick = (service) => {
    setSearchQuery(service.name);
    setSelectedService(service);
  };

  const getFilteredServices = () => {
    if (!searchQuery) {
      return serviceData;
    }

    return serviceData.filter((service) =>
      service.name.toLowerCase().includes(searchQuery)
    );
  };

  const filteredServices = getFilteredServices();

  const clearSearch = () => {
    setSearchQuery("");
    setSelectedService(null);
  };

  const handleServiceButtonClick = async (serverNumber) => {
    if (!user) {
      navigate("/login");
      return;
    }
    const service = selectedService;
    setLoading(true);
    const getNumberPromise = new Promise((resolve, reject) => {
      const getNumberRequest = async () => {
        try {
          await axios.get(
            `/get-number?api_key=${apiKey}&servicecode=${service.servicecode}&server=${serverNumber}`
          );
          resolve(); // Resolve the promise on success
        } catch (error) {
          // Reject the promise on error
          reject(error);
        } finally {
          setLoading(false);
        }
      };

      getNumberRequest();
    });
    await toast.promise(getNumberPromise, {
      loading: "Processing Request...",
      success: () => {
        fetchBalance(apiKey);
        navigate("/my-orders"); // Redirect on success
        return "Number Bought Successfully!";
      },
      error: (error) => {
        const errorMessage = error.response?.data?.error || "Please try again.";
        return errorMessage;
      },
    });
  };

  const anyOtherService = serviceData.find(
    (service) => service.name.toLowerCase() === "any other"
  );

  // Helper function to format the price
  // Helper function to format the price
  const formatPrice = (price) => {
    if (!price) {
      return "0";
    }

    const [integerPart, decimalPart] = price.split(".");
    const formattedInteger = integerPart.padStart(2, "0");
    const formattedPrice = `${formattedInteger}.${decimalPart || "00"}`;
    return formattedPrice;
  };

  const server5SingleOtp = {
    1: "anyother",
    2: "bajajfinserv",
    3: "bumble",
    4: "burgerking",
    5: "chalkboard",
    6: "citaprevia",
    7: "gmail",
    8: "hepsiburadacom",
    9: "hermes",
    10: "humblebundle",
    11: "myglo",
    12: "parlayplay",
    13: "paysafecard",
    14: "samsung",
    15: "sixer",
    16: "tantan",
    17: "telegram",
    18: "wechat",
    19: "winzogame",
  };

  return (
    <div className="h-[calc(100dvh-4rem)] flex flex-col items-center justify-center">
      <div className="w-full flex justify-center my-8">
        <div className="w-full max-w-[720px] flex flex-col items-center bg-[#121315] rounded-2xl p-3 md:p-5">
          <div className="w-full flex bg-[#18191c] rounded-2xl items-center h-[60px] mb-3 px-3 md:px-5">
            <Icon.search className="text-[30px] text-primary" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full h-[50px] ml-2 bg-transparent border-0 text-base text-white placeholder:text-primary focus:outline-none"
            />
            {searchQuery !== "" ? (
              <Icon.circleX
                className="text-primary cursor-pointer"
                onClick={clearSearch}
              />
            ) : (
              ""
            )}
          </div>
          <div className="flex flex-col w-full h-[450px] md:h-[340px]">
            <h5 className="p-3">
              {selectedService ? "Select Server" : "Services"}
            </h5>
            <div className="rounded-2xl flex flex-col overflow-y-auto hide-scrollbar h-full">
              {selectedService ? (
                selectedService.servers.map((server) => (
                  <button
                    className="bg-[#282828] py-4 px-3 md:px-5 flex mb-1 w-full items-center justify-between rounded-lg"
                    key={server._id}
                    disabled={loading}
                    onClick={() =>
                      handleServiceButtonClick(server.serverNumber)
                    }
                  >
                    <h3 className="capitalize font-medium flex flex-col items-start">
                      Server {server.serverNumber}
                      {server.serverNumber === 4 && (
                        <span className="text-sm text-gray-400">
                          (single otp)
                        </span>
                      )}
                      {server.serverNumber === 5 &&
                        Object.values(server5SingleOtp).includes(
                          selectedService.servicecode.toLowerCase()
                        ) && (
                          <span className="text-sm text-gray-400">
                            (single otp)
                          </span>
                        )}
                      {server.serverNumber === 7 && (
                        <span className="text-sm text-gray-400">
                          (single otp)
                        </span>
                      )}
                      {server.serverNumber === 9 && (
                        <span className="text-sm text-gray-400">
                          (single otp & fresh number)
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center">
                      <p className="text-base">{formatPrice(server.price)}</p>
                      <Icon.indianRupee className="w-4 h-4" />
                    </div>
                  </button>
                ))
              ) : filteredServices.length > 0 ? (
                filteredServices.map((i) => (
                  <button
                    className="bg-[#282828] py-4 px-3 md:px-5 flex mb-1 w-full items-center justify-between rounded-lg"
                    key={i.name}
                    onClick={() => handleServiceClick(i)}
                  >
                    <h3 className="capitalize font-medium text-start">
                      {i.name}
                    </h3>
                    <div className="flex items-center">
                      <p className="text-base">{formatPrice(i.lowestPrice)}</p>
                      <Icon.indianRupee className="w-4 h-4" />
                    </div>
                  </button>
                ))
              ) : (
                <button
                  className="bg-[#282828] py-4 px-3 md:px-5 flex mb-1 w-full items-center justify-between rounded-lg"
                  onClick={() => handleServiceClick(anyOtherService)}
                >
                  <h3 className="capitalize font-medium">
                    {anyOtherService.name}
                  </h3>
                  <div className="flex items-center">
                    <p className="text-base">
                      {formatPrice(anyOtherService.lowestPrice)}
                    </p>
                    <Icon.indianRupee className="w-4 h-4" />
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout()(Home);
