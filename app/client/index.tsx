"use client";
import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { MailProvider } from "./MailContext";
import Inbox from "./inbox";
import Compose from "./compose";
import Sent from "./sent";
import Drafts from "./draft";
import MailView from "./inbox/mail";
import { Nav } from "c4cui";
import { useAuth } from "../auth/AuthProvider";
import { BsSend } from "react-icons/bs";
import { TfiWrite } from "react-icons/tfi";
import { CiInboxIn, CiPen } from "react-icons/ci";

export default function Client() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <MailProvider>
      <div className="flex w-screen h-screen min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] overflow-hidden">
        <Nav
          header={{
            title: "Mail",
          }}
          items={[
            {
              active: location.pathname.startsWith("/mail/compose"),
              onClick: () => navigate("/mail/compose"),
              icon: <CiPen size={18} />,
              label: "Compose",
            },
            {
              active: location.pathname.startsWith("/mail/inbox"),
              onClick: () => navigate("/mail/inbox"),
              icon: <CiInboxIn size={18} />,
              label: "Inbox",
            },
            {
              active: location.pathname.startsWith("/mail/drafts"),
              onClick: () => navigate("/mail/drafts"),
              icon: <TfiWrite size={18} />,
              label: `Drafts`,
            },
            {
              active: location.pathname.startsWith("/mail/sent"),
              onClick: () => navigate("/mail/sent"),
              icon: <BsSend size={18} />,
              label: "Sent",
            },
          ]}
          profile={{
            username: profile?.first_name || "Profile",
            onUsernameClick: () => navigate("/user/"),
            avatar: profile?.avatar ? `${process.env.NEXT_PUBLIC_SERVER_URL}${profile?.avatar}` : undefined,
          }}
        />
        <Routes>
          <Route path="/:type/:id" element={<MailView />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/compose" element={<Compose />} />
          <Route path="/compose/:id" element={<Compose />} />
          <Route path="/sent" element={<Sent />} />
          <Route path="/drafts" element={<Drafts />} />
        </Routes>
      </div>
    </MailProvider>
  );
}
