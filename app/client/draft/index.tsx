import { useEffect } from "react";
import { useMail } from "../MailContext";
import { MailList } from "../inbox/components/mail_list";
import { Header } from "c4cui";

export default function Drafts() {
  const { drafts, getDrafts } = useMail();

  useEffect(() => {
    getDrafts();
  }, []);

  return (
    <div className="flex flex-col gap-8 rounded-xl grow p-4 overflow-y-auto">
      <Header title="Drafts" />
      {drafts && <MailList mails={drafts} />}
    </div>
  );
}
