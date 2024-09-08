import React, { lazy, Suspense, useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectRoute from "@/components/auth/ProtectRoute";
import { LayoutLoader } from "@/components/layout/Loaders";
import axios from "axios";
import { AuthContext } from "./utils/AppContext";
import HomeWrapper from "@/components/layout/HomeWrapper";
const Login = lazy(() => import("@/pages/Login"));
const SignUp = lazy(() => import("@/pages/SignUp"));
const ChangePassword = lazy(() => import("@/pages/ChangePassword"));
const Api_key = lazy(() => import("@/pages/Api"));
const GetNumber = lazy(() => import("@/pages/GetNumber"));
const Recharge = lazy(() => import("@/components/layout/RechargeWrapper"));
const VerifyTransaction = lazy(() => import("@/pages/VerifyTransaction"));
const History = lazy(() => import("@/pages/History"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Maintenance = lazy(() => import("@/pages/Maintenance"));
const About = lazy(() => import("@/pages/About"));
const CheckOtp = lazy(() => import("@/pages/CheckOtp"));

function App() {
  axios.defaults.baseURL = "https://api.paidsms.in/api";
  axios.defaults.withCredentials = true;
  const { user, setMaintainance, isGoogleLogin } = useContext(AuthContext);
  const [isMaintenance, setIsMaintenance] = useState(false);

  const fetchMaintenance = async () => {
    const response = await axios.get("/maintainance-check");
    setMaintainance(response.data.maintainance);
    setIsMaintenance(response.data.maintainance);
  };

  useEffect(() => {
    fetchMaintenance();
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<LayoutLoader />}>
        <Routes>
          {isMaintenance ? (
            <>
              <Route path="*" element={<Navigate to="/" />} />
              <Route path="/" element={<Maintenance />} />
            </>
          ) : (
            <>
              <Route path="/" element={<HomeWrapper />} />
              <Route
                path="/change-password"
                element={
                  <ProtectRoute
                    user={user}
                    googleRedirect="/" // Redirect to home if logged in with Google
                    redirect="/"
                    isGoogleLogin={isGoogleLogin}
                  >
                    <ChangePassword />
                  </ProtectRoute>
                }
              />
              <Route
                path="/api"
                element={
                  <ProtectRoute user={user} redirect="/">
                    <Api_key />
                  </ProtectRoute>
                }
              />
              <Route
                path="/get-number"
                element={
                  <ProtectRoute user={user} redirect="/">
                    <GetNumber />
                  </ProtectRoute>
                }
              />
              <Route
                path="/recharge"
                element={
                  <ProtectRoute user={user} redirect="/">
                    <Recharge />
                  </ProtectRoute>
                }
              />
              <Route
                path="/verify-transaction"
                element={
                  <ProtectRoute user={user} redirect="/">
                    <VerifyTransaction />
                  </ProtectRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectRoute user={user} redirect="/">
                    <History />
                  </ProtectRoute>
                }
              />
              <Route
                path="/my-orders"
                element={
                  <ProtectRoute user={user} redirect="/">
                    <GetNumber />
                  </ProtectRoute>
                }
              />
              <Route
                path="/check-otp"
                element={
                  <ProtectRoute user={user} redirect="/">
                    <CheckOtp />
                  </ProtectRoute>
                }
              />
              <Route
                path="/about"
                element={
                  <ProtectRoute user={user || !user} redirect="/">
                    <About />
                  </ProtectRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <ProtectRoute user={!user} redirect="/">
                    <Login />
                  </ProtectRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <ProtectRoute user={!user} redirect="/">
                    <SignUp />
                  </ProtectRoute>
                }
              />
              <Route path="/*" element={<NotFound />} />
            </>
          )}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
