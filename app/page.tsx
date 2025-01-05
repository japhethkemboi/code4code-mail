"use client";
import React, { useEffect, useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthProvider";
import { ToastContainer } from "react-toastify";
import Login from "./auth/login";
import { Signup } from "./auth/signup";
import AdminConsole from "./admin-console";
import Client from "./client";

export default function App() {
  const [render, setRender] = useState(false);

  useEffect(() => setRender(true), []);
  if (!render) {
    return null;
  }

  return (
    <AuthProvider>
      <Router>
        <Home />
      </Router>
    </AuthProvider>
  );
}

const Home = () => {
  const { access } = useAuth();
  return (
    <>
      <Routes>
        {access ? (
          <>
            <Route path="/console/*" element={<AdminConsole />} />
            <Route path="/mail/*" element={<Client />} />
          </>
        ) : (
          <>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer />
    </>
  );
};

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("access");
    if (!accessToken) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen items-center justify-center text-center text-red-500">
      <h2>404 - Oops! Not Found. You're lost princess.</h2>
    </div>
  );
};
