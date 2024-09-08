import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { AuthContext } from "@/utils/AppContext";
import axios from "axios";
import { useContext, useState } from "react";

const CheckOtp = () => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpText, setOtpText] = useState([]);
  const [notFound, setNotFound] = useState(false);

  const { apiKey } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const encodedotp = encodeURIComponent(otp);

    setIsLoading(true);

    try {
      const response = await axios.get(
        `/check-otp?otp=${encodedotp}&api_key=${apiKey}`
      );

      setOtp("");
      setOtpText(response.data.results || []);
      setNotFound(response.data.results.length === 0);
    } catch (error) {
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100dvh-4rem)] flex flex-col items-center justify-center">
      <Card className="bg-[#121315] w-full max-w-md p-4 rounded-lg border-none dark">
        <CardHeader>
          <CardTitle className="text-center font-medium">Check Otp</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <div className="relative">
                  <Input
                    id="check-otp"
                    placeholder="Enter the otp"
                    className="w-full h-12 pl-3 pr-10 rounded-lg text-[#9d9d9d] placeholder-text-[#9d9d9d] bg-transparent border-[#e0effe] focus:border-none"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="login"
              className="w-full text-sm font-normal mb-4"
              isLoading={isLoading}
            >
              Submit
            </Button>
          </form>

          {notFound ? (
            <div className="bg-[#282828] py-4 px-3 md:px-5 flex mb-1 w-full items-center justify-center rounded-lg">
              <h3 className="capitalize font-medium flex flex-col items-center">
                Not Found
              </h3>
            </div>
          ) : (
            otpText.map((name, index) => (
              <div
                key={index}
                className="bg-[#282828] py-4 px-3 md:px-5 flex mb-1 w-full items-center justify-between rounded-lg"
              >
                <h3 className="capitalize font-medium flex flex-col items-start">
                  {name}
                </h3>
                <div className="flex items-center">
                  <p className="text-base">Server 1</p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppLayout()(CheckOtp);
