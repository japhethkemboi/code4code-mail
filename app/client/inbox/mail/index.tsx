"use client";
import { useEffect, useState } from "react";
import { To, useNavigate, useParams } from "react-router-dom";
import { Mail, Reply } from "@/app/interface";
import { toast } from "react-toastify";
import { PiArchive, PiArchiveFill, PiArrowBendUpRight, PiTrash, PiWarningOctagon } from "react-icons/pi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Button, Header } from "c4cui";
import { useMail } from "../../MailContext";
import { MailCard } from "./MailCard";

export default function MailView() {
  const { id } = useParams();
  const [mail, setMail] = useState<Mail>();
  const [replies, setReplies] = useState<Reply[]>([]);
  const navigate = useNavigate();
  const [fetching, setFetching] = useState(false);
  const { getMail, getReplies } = useMail();
  const { toggleArchive, deleteMail } = useMail();

  useEffect(() => {
    if (id) {
      handleGetMail(parseInt(atob(id)));
    } else {
      navigate((-1 as To) || "/mail/inbox");
    }
  }, [id]);

  const handleGetMail = async (id: number) => {
    setFetching(true);
    const res = await getMail(id);
    if (res.mail) {
      setMail(res.mail);
      const resReplies = await getReplies(id);
      if (resReplies.replies) {
        setReplies(resReplies.replies);
      } else {
        toast.error(resReplies.error);
      }
    } else {
      toast.error(res.error || "Failed to fetch draft. Please try again.");
    }
    setFetching(false);
  };

  const handleToggleArchive = async (id: number, archived: boolean) => {
    const res = await toggleArchive(id, archived);
    if (res.ok) {
      toast.success(res.message);
      handleGetMail(id);
    } else {
      toast.error(res.message);
    }
  };

  const handleDelete = async (id: number) => {
    const res = await deleteMail(id);
    if (res.ok) {
      toast.success(res.message);
      navigate(-1 || "/mail/inbox");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="flex flex-col gap-8 rounded-xl grow p-4 overflow-y-auto">
      <Header back={() => navigate(-1)} title="Mail">
        <Button className="p-2 border-none" outline={true} icon={<PiWarningOctagon size={18} />} />
        <Button
          onClick={() => mail?.id && handleDelete(mail?.id)}
          className="p-2 border-none"
          outline={true}
          icon={<PiTrash size={18} />}
        />
        <Button
          onClick={() => mail?.id && handleToggleArchive(mail?.id, mail?.archived || false)}
          className="p-2 border-none"
          outline={true}
          icon={mail?.archived ? <PiArchiveFill size={18} /> : <PiArchive size={18} />}
        />
        <Button className="p-2 border-none" outline={true} icon={<PiArrowBendUpRight size={18} />} />
        <Button className="p-2 border-none" outline={true} icon={<BsThreeDotsVertical size={18} />} />
      </Header>
      <div className="flex flex-col gap-8 h-full overflow-y-scroll bg-[var(--mail-list-bg-color)] rounded-xl border border-[var(--mail-list-border-color)] overflow-hidden w-full">
        {mail && <MailCard mail={mail} refreshMail={handleGetMail} />}
        {replies.map((reply) => (
          <div key={reply.id} className="w-full border-t border-black/20">
            <MailCard reply={reply} refreshMail={handleGetMail} />
          </div>
        ))}
      </div>
    </div>
  );
}
