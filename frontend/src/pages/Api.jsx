import AppLayout from "@/components/layout/AppLayout";
import PopoverComponent from "@/components/shared/PopoverComponent";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { AuthContext } from "@/utils/AppContext";
import axios from "axios";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";

const Api = () => {
  const { apiKey, setApiKey, user } = useContext(AuthContext);
  const [openSection, setOpenSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleApiKeyChange() {
    setLoading(true);
    const changeApiKeyPromise = new Promise((resolve, reject) => {
      const fetchNewApiKey = async () => {
        try {
          // Fetch the new API key
          const response = await axios.get(
            `/change_api_key?userId=${user.userId}`
          );

          // Assuming your backend returns the new API key in response.data.api_key
          const newApiKey = response.data.api_key;

          setApiKey(newApiKey);

          resolve(newApiKey);
        } catch (error) {
          reject(error);
        } finally {
          setLoading(false);
        }
      };

      fetchNewApiKey();
    });
    await toast.promise(changeApiKeyPromise, {
      loading: "Changing API key...",
      success: "API key changed successfully",
      error: "Error changing API key",
    });
  }

  const toggleSection = (section) => {
    setOpenSection((prevSection) => (prevSection === section ? null : section));
  };

  const wrapStyle = {
    wordBreak: "break-word",
    whiteSpace: "normal",
    overflowWrap: "break-word",
  };

  const handleCopy = () => {
    setOpen(true);
    navigator.clipboard.writeText(apiKey);
  };

  const sections = [
    {
      name: "Get Number",
      id: "request_number",
      link: "/get-number?api_key=${api_key}&servicecode=${service_code}&server=${server_number}",
    },
    {
      name: "Get Otp",
      id: "activation_status",
      link: "/get-otp?api_key=${api_key}&id=${id}&server=${server_number}",
    },
    {
      name: "Cancel Number",
      id: "get_activation_status",
      link: "/number-cancel?api_key=${api_key}&id=${id}&server=${server_number}",
    },
    {
      name: "Get Balance",
      id: "balance_request",
      link: "/balance?api_key=${api_key}",
    },
    {
      name: "Service Code and Price",
      id: "service_codes_prices",
      link: "/get-service?api_key=${api_key}",
    },
  ];

  return (
    <div className="mt-20 lg:mt-10">
      <div style={{ textAlign: "center" }}>
        <div className="flex gap-4 items-center justify-center">
          <h3 className="flex gap-3 flex-col md:flex-row text-[15px] lg:text-[30px] leading-[20px] lg:leading-[30px] font-normal lg:font-[500] text-center">
            <span className="text-primary">API Key:</span>{" "}
            <div className=" flex items-center justify-center gap-4">
              {apiKey ? apiKey : "API key Not found Please change API Key"}

              <PopoverComponent
                buttonComponent={
                  <Button
                    variant="link"
                    className="p-0 h-0"
                    onClick={handleCopy}
                  >
                    <Icon.copy className="w-5 h-5" />
                  </Button>
                }
                open={open}
                setOpen={setOpen}
                popoverContent="Copied!"
              />
            </div>
          </h3>
        </div>
        <Button
          type="button"
          onClick={handleApiKeyChange}
          variant="login"
          isLoading={loading}
          className="w-full md:w-[30%] text-sm font-normal mb-4"
        >
          Change API
        </Button>
      </div>
      <div className="w-full flex justify-center my-8">
        <div className="w-full max-w-[820px] flex flex-col items-center bg-[#121315] rounded-2xl p-5">
          {sections.map((section) => (
            <div
              key={section.id}
              className="w-full flex flex-col bg-[#18191c] rounded-2xl mb-2"
            >
              <div
                className="w-full flex items-center justify-between h-[50px] cursor-pointer"
                onClick={() => toggleSection(section.id)}
              >
                <button className="bg-transparent py-4 px-5 flex w-full items-center justify-between rounded-lg">
                  <h3 className="font-normal">{section.name}</h3>
                  <div className="flex items-center">
                    <p className="text-xl">
                      {openSection === section.id ? "-" : "+"}
                    </p>
                  </div>
                </button>
              </div>
              {openSection === section.id && (
                <div
                  className="w-full bg-[#1e1e1e] rounded-b-lg py-3 px-5 mt-2"
                  style={wrapStyle}
                >
                  <p className="text-sm text-white">
                    {axios.defaults.baseURL}
                    {section.link}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppLayout()(Api);
