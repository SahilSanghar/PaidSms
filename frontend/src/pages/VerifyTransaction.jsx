import AppLayout from "@/components/layout/AppLayout";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import QRImage from "../assets/Group 1000001037.png";

const VerifyTransaction = () => {
  return (
    <div className="mt-10 overflow-y-auto">
      <div className="w-full flex justify-center my-10">
        <div className="w-full max-w-[820px] flex flex-col items-center bg-[#121315] rounded-2xl p-5 md:p-8 ">
          <div className="w-full flex rounded-2xl items-center mb-4">
            <h3 className="font-medium text-[18px] lg:text-[25px]">
              Verify your transaction
            </h3>
          </div>

          <div className="w-full flex items-center justify-between">
            <div className="flex flex-col gap-3">
              <div className="font-medium text-base flex items-center gap-6">
                <p className="">Wallet Address:</p>
                <span
                  className={buttonVariants({
                    variant: "link",
                    className:
                      "!no-underline active:transform-none !p-0 !font-medium !text-base !h-auto",
                  })}
                >
                  Tbdjsfzzxre784p
                  <Icon.copy className="text-white w-5 h-5 ml-1 fill-white cursor-pointer transition-transform active:scale-95" />
                </span>
              </div>
              <div className="font-medium text-base flex items-center gap-6">
                <p className="">Trx Price:</p>
                <span className="flex items-center">
                  9.8
                  <Icon.indianRupee className="text-white w-4 h-4 fill-white cursor-pointer transition-transform active:scale-95" />
                </span>
              </div>
              <div className="font-medium text-base flex items-center gap-6">
                <p className="">Amount:</p>
                <span>28 Trx</span>
              </div>
            </div>
            <div>
              <img src={QRImage} alt="" width={150} />
            </div>
          </div>

          <div className="w-full mb-3 flex flex-col gap-2">
            <div className="font-normal text-sm flex items-center gap-2">
              <p className="">15:23s</p>
              <span>Time Left</span>
            </div>
            <div className="font-normal text-sm flex items-center">
              <p className="">Checking Transaction</p>
            </div>
          </div>
          <p className="text-sm text-[#b7b7b7]">Don`t refresh the page</p>
          <Button
            type="submit"
            variant="login"
            className="w-full md:w-[50%] text-sm py-1 px-8 !rounded-md border-2 border-primary font-normal hover:!bg-primary transition-colors duration-200 ease-in-out !bg-transparent"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppLayout()(VerifyTransaction);
