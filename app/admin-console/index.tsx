"use client";
import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "./dashboard";
import { GlobalProvider } from "./GlobalContext";
import Organization from "./organization";
import Users from "./users";
import { CreateUser } from "./users/create";
import { Nav } from "c4cui";
import { MdOutlineSpaceDashboard, MdSpaceDashboard } from "react-icons/md";
import { PiBuildingOffice, PiUsers } from "react-icons/pi";

export default function AdminConsole() {
  const location = useLocation();

  return (
    <GlobalProvider>
      <div className="flex w-screen h-screen min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] overflow-hidden">
        <Nav
          items={[
            {
              label: "ADMIN CONSOLE",
              active: true,
            },
            {
              label: "Dashboard",
              active: location.pathname === "/console/",
              link: "/console/",
              icon:
                location.pathname === "/console/" ? (
                  <MdSpaceDashboard size={18} />
                ) : (
                  <MdOutlineSpaceDashboard size={18} />
                ),
            },
            {
              active: location.pathname.includes("/console/organization/user"),
              link: "/console/organization/users/",
              icon: <PiUsers size={18} />,
              label: "Users",
            },
            {
              active: location.pathname.includes("/console/organization") && !location.pathname.includes("user"),
              link: "/console/organization/",
              icon: <PiBuildingOffice size={18} />,
              label: "Organization",
            },
          ]}
        />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/organization/" element={<Organization />} />
          <Route path="/organization/users/" element={<Users />} />
          <Route path="/organization/user/add/" element={<CreateUser />} />
        </Routes>
      </div>
    </GlobalProvider>
  );
}
