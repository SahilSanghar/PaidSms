import AppLayout from "@/components/layout/AppLayout";
import React, { useState } from "react";

const About = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection((prevSection) => (prevSection === section ? null : section));
  };

  const wrapStyle = {
    wordBreak: "break-word",
    whiteSpace: "pre-line", // Preserve line breaks and whitespace
    overflowWrap: "break-word",
  };

  const sections = [
    {
      name: "How to use",
      id: "1",
      link: `Create account or Log in.

Recharge your wallet via any of the payment methods offered by our website upi or trx.

Note: in upi recharge below minimum amount.. amount will not added and no refund will be made

Select a Service
Search your desire service name which you can receive an SMS code for. If the service you need is not listed, try using "Any Other" and Select any Server and Click On It

Use Phone Number that You Received where needed Click "Cancel" in case you do not get sms after 1 minute. Amount will refunded immediately in your wallet.`,
    },
    {
      name: "How to use Servers",
      id: "2",
      link: `There are many servers with their own prices each server have different prices you can choose your desire Server`,
    },
    {
      name: "What is Single sms or fresh number",
      id: "3",
      link: `In Some servers there is a indication of single sms & fresh number if any server have single sms it means you can only get one time sms.

If any server have single sms & fresh number it means on that server signle sms will come and fresh number will come`,
    },
    {
      name: "No Number Available",
      id: "4",
      link: `If you see no number available that mean on this server no number is available due to heavy demand and short supply so in this case you can select other servers or can wait for sometime to add stock automatically. Stock adds automatically`,
    },
    {
      name: "Number Validity",
      id: "5",
      link: `After purchasing a number that number only valid 5-19 minutes after time out number will expire and can't use again`,
    },
    {
      name: "How Many Sms I can Get",
      id: "6",
      link: `If you selected server which have single sms or fresh number that mean on that number you will get only 1sms
And on other servers you can get  multiple sms and there's no guarantee you will get multiple sms cuz it depends on server side we can't control this`,
    },
    {
      name: "How to get Next Sms",
      id: "7",
      link: `If selected server is Single sms you can't get Next sms and on other servers after getting 1st sms other sms will show automatically when you send new sms and there's no guarantee that new sms will come cuz it depends on server side we can't control`,
    },
    {
      name: "Refund Policy",
      id: "8",
      link: `After getting number there is no sms after 1 mint you can Cancel the number and money will be refunded immediately in your wallet`,
    },
  ];

  return (
    <div className="mt-20 lg:mt-10">
      <div className="max-w-[800px] mx-auto">
        <h3 className="text-[20px] lg:text-[30px] leading-[30px] lg:leading-[55px] font-[600] lg:font-[500] text-center">
          <span className="text-primary">About</span> Paid SMS{" "}
        </h3>
        <p className="text-center italic font-normal">
          When registering for accounts on platforms such as TikTok, Facebook,
          YouTube, Google, and various other online services, you often face SMS
          verification requirements. PaidSMS simplifies this process by offering
          temporary virtual phone numbers. By using PaidSMS, you can obtain
          verification codes online without relying on your personal phone
          number, facilitating the effortless creation of multiple accounts
          across different sites.
        </p>
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
                  <h3 className="font-normal text-left">{section.name}</h3>
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
                  <p className="text-sm text-white font-normal">
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

export default AppLayout()(About);
