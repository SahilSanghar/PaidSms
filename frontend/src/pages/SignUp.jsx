import React, { useState, useEffect, useContext } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icons";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Eye, EyeOff } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";
import { useInputValidation } from "6pp";
import {
  confirmPasswordValidator,
  emailValidator,
  passwordValidator,
} from "@/utils/validators";
import toast from "react-hot-toast";
import axios from "axios";
import Otp from "@/components/ui/Otp";
import { useGoogleLogin } from "@react-oauth/google";
import { AuthContext } from "@/utils/AppContext";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [captchaValue, setCaptchaValue] = useState("");
  const email = useInputValidation("", emailValidator);
  const password = useInputValidation("", passwordValidator);
  const confirmPassword = useInputValidation("", (value) =>
    confirmPasswordValidator(value, password.value)
  );
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendEnabled, setResendEnabled] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    let interval;
    if (showOTP && !resendEnabled) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setResendEnabled(true);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOTP, resendEnabled]);

  const navigateToLogIn = () => navigate("/login");

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleOtpChange = (value) => {
    setOtp(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaValue) {
      toast.error("Please complete the CAPTCHA");
      return;
    }
    setIsLoading(true);
    const signupPromise = new Promise((resolve, reject) => {
      const signupRequest = async () => {
        try {
          const response = await axios.post("/signup", {
            email: email.value,
            captcha: captchaValue,
          });

          resolve(response);
        } catch (error) {
          reject(error);
        } finally {
          setIsLoading(false);
        }
      };

      signupRequest();
    });
    await toast.promise(signupPromise, {
      loading: "Processing Request...",
      success: (r) => {
        setShowOTP(true);
        return r.data?.message;
      },
      error: (error) => {
        const errorMessage =
          error.response?.data?.error || "SignUp failed. Please try again.";
        return errorMessage;
      },
    });
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);

    const otpVerificationPromise = new Promise((resolve, reject) => {
      const otpVerificationRequest = async () => {
        try {
          const response = await axios.post("/verify-otp", {
            email: email.value,
            otp,
            password: password.value,
          });

          resolve(response);
        } catch (error) {
          reject(error);
        } finally {
          setIsLoading(false);
        }
      };

      otpVerificationRequest();
    });

    await toast.promise(otpVerificationPromise, {
      loading: "Verifying OTP...",
      success: (r) => {
        navigateToLogIn();
        return r.data?.message;
      },
      error: (error) => {
        const errorMessage =
          error.response?.data?.error ||
          "OTP verification failed. Please try again.";
        return errorMessage;
      },
    });
  };

  const handleResendOtp = async () => {
    setResendEnabled(false);
    setTimer(60);

    try {
      await axios.post("/resend-otp", { email: email.value });
      toast.success("OTP resent successfully");
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        const response = await axios.post("/google-signup", {
          token: codeResponse.access_token,
        });

        // Destructure the token from the API response
        const { token } = response.data;

        login(token);

        // Navigate to the home page
        navigate("/");
      } catch (error) {
        // Display an error message using toast if Signup fails
        toast.error(error.response?.data?.error || "Failed to register.");
      }
    },
    onError: (error) => {
      // Display an error message using toast if Google Signup fails
      toast.error("Signup Failed: " + error.message);
    },
  });
  return (
    <div className="h-[calc(100dvh-4rem)] flex items-center justify-center">
      <Card className="bg-[#121315] w-full max-w-md p-4 rounded-lg border-none dark">
        <CardHeader>
          <CardTitle className="text-center font-medium">
            {showOTP ? "Verify OTP" : "Create an account"}
          </CardTitle>
        </CardHeader>

        {!showOTP ? (
          <CardContent className="p-0 md:p-6 !pt-0">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="email"
                    className="block text-sm text-[#9d9d9d] font-normal py-1"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    className="w-full h-12 pl-3 rounded-lg text-[#9d9d9d] placeholder-text-[#9d9d9d] bg-transparent border-[#e0effe] focus:border-none"
                    value={email.value}
                    onChange={email.changeHandler}
                    required
                  />
                  {email.error && (
                    <span className="text-red-500 text-xs">{email.error}</span>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="password"
                    className="block text-sm text-[#9d9d9d] font-normal py-1"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full h-12 pl-3 pr-10 rounded-lg text-[#9d9d9d] placeholder-text-[#9d9d9d] bg-transparent border-[#e0effe] focus:border-none"
                      value={password.value}
                      onChange={password.changeHandler}
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 px-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-[#9d9d9d]" />
                      ) : (
                        <Eye className="w-5 h-5 text-[#9d9d9d]" />
                      )}
                    </button>

                    {password.error && (
                      <span className="text-red-500 text-xs">
                        {password.error}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="confirm-password"
                    className="block text-sm text-[#9d9d9d] font-normal py-1"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full h-12 pl-3 pr-10 rounded-lg text-[#9d9d9d] placeholder-text-[#9d9d9d] bg-transparent border-[#e0effe] focus:border-none"
                      value={confirmPassword.value}
                      onChange={confirmPassword.changeHandler}
                      required
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute inset-y-0 right-0 px-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5 text-[#9d9d9d]" />
                      ) : (
                        <Eye className="w-5 h-5 text-[#9d9d9d]" />
                      )}
                    </button>
                  </div>
                  {confirmPassword.error && (
                    <span className="text-red-500 text-xs">
                      {confirmPassword.error}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-center mb-4 mt-8">
                <ReCAPTCHA
                  theme="dark"
                  className="scale-[0.85] md:transform-none"
                  sitekey="6LeAfAoqAAAAAPKwGgbxZpBXsBZ4hZ1iazAvta6e"
                  onChange={(value) => setCaptchaValue(value)}
                />
              </div>

              <Button
                type="submit"
                variant="login"
                className="w-full text-sm font-normal mb-4"
                isLoading={isLoading}
                disabled={
                  !captchaValue ||
                  (captchaValue && isLoading) ||
                  !email.value ||
                  !password.value ||
                  password.error ||
                  !confirmPassword.value ||
                  confirmPassword.error
                }
              >
                Create Account
              </Button>
              <Button
                variant="outline"
                className="w-full text-sm"
                type="button"
                onClick={handleGoogleLogin}
              >
                <Icon.google className="w-4 h-4 mr-1" /> Continue with Google
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-[#BEBEBF] font-normal">
              Already have an account?{" "}
              <Button
                variant="link"
                className="!no-underline py-0 px-1 text-sm font-normal h-0"
                onClick={navigateToLogIn}
              >
                Login
              </Button>
            </div>
          </CardContent>
        ) : (
          <form onSubmit={handleOtpSubmit}>
            <div className="flex items-center justify-center gap-4 flex-col ">
              <Otp length={6} otp={otp} onOtpChange={handleOtpChange} />

              <div className="flex justify-center">
                <Button
                  variant="link"
                  className="text-sm font-normal text-[#397CFF] !no-underline p-1 h-0"
                  onClick={handleResendOtp}
                  disabled={!resendEnabled}
                >
                  Resend OTP {resendEnabled ? "" : `(${timer}s)`}
                </Button>
              </div>

              <Button
                type="submit"
                variant="login"
                className="w-full text-sm font-normal my-4"
                disabled={otp.length !== 6 || isLoading}
                isLoading={isLoading}
              >
                Submit
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default AppLayout()(SignUp);
