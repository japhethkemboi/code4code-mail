"use client";
import { Button, Header } from "c4cui";
import { useMail } from "../MailContext";
import { useEffect } from "react";
import { formatDateRegionally } from "../utils";
import { PiArchive, PiStar, PiTrash } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { MailList } from "../inbox/components/mail_list";

export default function Sent() {
  const { sent, getSent } = useMail();
  const navigate = useNavigate();

  useEffect(() => {
    getSent();
  }, []);

  return (
    <div className="flex flex-col gap-8 rounded-xl grow p-4 overflow-y-auto">
      <Header title="Sent" />
      {sent && <MailList mails={sent.filter((mail) => mail)} />}
    </div>
  );
}
