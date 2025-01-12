"use client";
import { useEffect } from "react";
import { useMail } from "../MailContext";
import { MailList } from "./components/mail_list";
import { Header } from "c4cui";

export default function Inbox() {
  const { inbox, getInbox } = useMail();

  useEffect(() => {
    getInbox();
  }, []);

  return (
    <div className="flex flex-col gap-8 rounded-xl grow p-4 overflow-y-auto">
      <Header title="Inbox" />
      {inbox && <MailList mails={inbox.filter((mail) => mail.archived !== true)} />}
    </div>
  );
}
