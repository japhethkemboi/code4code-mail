import { Mail, Reply } from "@/app/interface";
import { Button, InputComponent } from "c4cui";
import { PiArrowBendUpLeft, PiStar, PiStarFill, PiUser } from "react-icons/pi";
import { formatDateRegionally } from "../../utils";
import { useState } from "react";
import { BiSend } from "react-icons/bi";
import { toast } from "react-toastify";
import { useMail } from "../../MailContext";
import { CgClose } from "react-icons/cg";
import { useAuth } from "@/app/auth/AuthProvider";

export const MailCard = ({
  mail,
  reply,
  refreshMail,
}: {
  mail?: Mail;
  reply?: Reply;
  isReply?: boolean;
  refreshMail?: (id: number) => Promise<void>;
}) => {
  const [replyBody, setReplyBody] = useState("");
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const { createReply, toggleStar } = useMail();
  const { profile } = useAuth();

  const handleReply = async () => {
    setSending(true);
    if (replyBody.trim().length > 0) {
      const res = await createReply({
        mail: mail?.id || reply?.mail,
        parent_reply: reply?.id,
        body: replyBody,
      });
      if (res.reply) {
        toast.success("Reply sent.");
        setReplyBody("");
        if (refreshMail) {
          if (mail?.id) {
            refreshMail(mail.id);
          }
          if (reply?.mail) {
            refreshMail(reply?.mail);
          }
        }
      } else {
        toast.error(res.error || "Failed to send email. Please try again.");
      }
    }
    setSending(false);
  };

  const handleToggleStar = async (id: number, type: "mail" | "reply", starred: boolean) => {
    const res = await toggleStar(id, type, starred);
    if (res.ok) {
      if (refreshMail) {
        if (type === "mail" && mail?.id) {
          refreshMail(mail?.id);
        } else if (reply?.mail) {
          refreshMail(reply.mail);
        }
      }
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="flex flex-col gap-8 p-4 w-full">
      <div className="flex gap-4 justify-between">
        <div className="flex items-center w-full gap-2">
          <p className="rounded-full p-2 bg-[var(--primary-color)] text-[var(--bg-color)]">
            <PiUser size={20} />
          </p>
          <div className="flex flex-col">
            {mail?.sender?.username === profile?.username || reply?.sender.username === profile?.username ? (
              <p className="font-semibold">You</p>
            ) : (
              <>
                <p className="font-semibold">
                  {mail?.sender
                    ? mail?.sender?.first_name || "" + " " + reply?.sender.last_name || ""
                    : reply?.sender
                    ? reply?.sender?.first_name || "" + " " + reply?.sender.last_name || ""
                    : ""}
                </p>
                <p className="text-xs">{mail?.sender?.username || reply?.sender.username}</p>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-2 shrink-0 items-center">
          <time className="text-sm">
            {mail?.sent_at
              ? formatDateRegionally(mail?.sent_at, "long")
              : reply?.created_at
              ? formatDateRegionally(reply?.created_at, "long")
              : ""}
          </time>
          {!isReplyOpen && (
            <Button
              onClick={() => setIsReplyOpen(true)}
              className="p-2 border-none"
              outline={true}
              icon={<PiArrowBendUpLeft size={18} />}
            />
          )}
          <Button
            onClick={() => {
              if (mail?.id) {
                handleToggleStar(mail?.id, "mail", mail?.starred || false);
              } else if (reply?.id) {
                handleToggleStar(reply?.id, "reply", reply?.starred || false);
              }
            }}
            className="p-2 border-none"
            outline={true}
            icon={mail?.starred || reply?.starred ? <PiStarFill size={18} /> : <PiStar size={18} />}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="font-semibold text-xl">{mail?.subject}</h1>
        <div dangerouslySetInnerHTML={{ __html: mail?.body || reply?.body || "" }} />
      </div>
      <div className="flex gap-2 items-center flex-wrap"></div>
      {isReplyOpen && (
        <div className="flex items-end gap-4 w-full mt-auto">
          <InputComponent
            type="textarea"
            placeholder="Compose message"
            rows={3}
            inputClasses="rounded-xl"
            value={replyBody}
            onChange={setReplyBody}
          />
          <div className="flex flex-col gap-2 justify-between">
            <Button outline={true} icon={<CgClose />} className="border-none" onClick={() => setIsReplyOpen(false)} />
            <Button outline={true} icon={<BiSend />} disabled={sending} onClick={handleReply} label="Send" />
          </div>
        </div>
      )}
    </div>
  );
};
