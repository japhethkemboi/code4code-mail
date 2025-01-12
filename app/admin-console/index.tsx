"use client";
import React from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Dashboard from "./dashboard";
import { ConsoleProvider } from "./ConsoleContext";
import Organization from "./organization";
import { CreateUser } from "./user/create";
import { Nav } from "c4cui";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { PiBuildingOffice } from "react-icons/pi";
import { useAuth } from "../auth/AuthProvider";
import Users from "./user";

export default function AdminConsole() {
  const { profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <ConsoleProvider>
      <div className="flex w-screen h-screen min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] overflow-hidden">
        <Nav
          header={{
            title: "ADMIN CONSOLE",
          }}
          items={[
            {
              label: "Dashboard",
              active: location.pathname === "/console/" || location.pathname === "/console",
              onClick: () => navigate("/console/"),
              icon: <MdOutlineSpaceDashboard size={18} />,
            },
            {
              label: "Organization",
              active: location.pathname.startsWith("/console/organization") && !location.pathname.includes("user"),
              onClick: () => navigate("/console/organization/"),
              icon: <PiBuildingOffice size={18} />,
            },
          ]}
          profile={{
            username: profile?.first_name || "Profile",
            onUsernameClick: () => navigate("/user/"),
            avatar: profile?.avatar ? `${process.env.NEXT_PUBLIC_SERVER_URL}${profile?.avatar}` : undefined,
          }}
        />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/organization/" element={<Organization />} />
          <Route path="/organization/users/" element={<Users />} />
          <Route path="/organization/user/add/" element={<CreateUser />} />
        </Routes>
      </div>
    </ConsoleProvider>
  );
}
