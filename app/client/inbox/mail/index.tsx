"use client";
import { useEffect, useState } from "react";
import { formatDateRegionally, getMail } from "../../utils";
import { Link, To, useNavigate, useParams } from "react-router-dom";
import { Mail } from "@/app/interface";
import { toast } from "react-toastify";
import {
  PiArchive,
  PiArrowBendUpLeft,
  PiArrowBendUpRight,
  PiStar,
  PiTrash,
  PiUser,
  PiWarningOctagon,
} from "react-icons/pi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Button, Header, InputComponent } from "c4cui";
import { BiSend } from "react-icons/bi";

export default function MailView() {
  const { id } = useParams();
  const [mail, setMail] = useState<Mail>();
  const navigate = useNavigate();
  const [fetching, setFetching] = useState(false);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (id) {
      handleGetMail(parseInt(atob(id)));
    } else {
      navigate((-1 as To) || "/mail/inbox");
    }
  }, [id]);

  const handleGetMail = async (id: number) => {
    setFetching(true);
    const accessToken = localStorage.getItem("access");
    if (accessToken) {
      const res = await getMail(id, accessToken);
      if (res.mail) {
        setMail(res.mail);
      } else if (res.error === "404") {
        navigate((-1 as To) || "/mail/inbox");
      } else {
        toast.error(res.error || "Failed to fetch draft. Please try again.");
      }
    }
    setFetching(false);
  };

  const handleSend = () => {};

  return (
    <div className="flex flex-col gap-8 rounded-xl grow p-4 overflow-y-auto">
      <Header back={() => navigate(-1)} title="Mail">
        <Button className="p-2 border-none" outline={true} icon={<PiArrowBendUpLeft size={18} />} />
        <Button className="p-2 border-none" outline={true} icon={<PiWarningOctagon size={18} />} />
        <Button className="p-2 border-none" outline={true} icon={<PiStar size={18} />} />
        <Button className="p-2 border-none" outline={true} icon={<PiTrash size={18} />} />
        <Button className="p-2 border-none" outline={true} icon={<PiArchive size={18} />} />
        <Button className="p-2 border-none" outline={true} icon={<PiArrowBendUpRight size={18} />} />
        <Button className="p-2 border-none" outline={true} icon={<BsThreeDotsVertical size={18} />} />
      </Header>
      <div className="flex flex-wrap gap-2 items-center">
        {mail?.recipients?.map((recipient) => (
          <Link key={recipient} to="/" className="flex items-center w-full gap-2">
            <p className="rounded-full p-2 bg-[var(--primary-color)] text-[var(--bg-color)]">
              <PiUser size={24} />
            </p>
            <div className="flex flex-col">
              <p className="text-sm">{recipient}</p>
              <p className="text-xs">{recipient}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex gap-2 items-center">
        <time>{mail?.sent_at && formatDateRegionally(mail?.sent_at, "long")}</time>
      </div>
      <div className="flex flex-col gap-8 p-4 h-full overflow-y-scroll bg-[var(--mail-list-bg-color)] rounded-xl border border-[var(--mail-list-border-color)] overflow-hidden w-full">
        <h1 className="font-semibold text-xl">{mail?.subject}</h1>
        <p>{mail?.body}</p>
      </div>
      <div className="flex items-end gap-4 w-full">
        <InputComponent
          type="textarea"
          placeholder="Compose message"
          rows={3}
          inputClasses="rounded-xl"
          value={reply}
          onChange={(e) => setReply(e)}
        />
        <Button disabled={sending} outline={true} icon={<BiSend />} onClick={handleSend} label="Send" />
      </div>
    </div>
  );
}
