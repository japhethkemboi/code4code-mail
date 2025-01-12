"use client";
import { useState, useEffect } from "react";
import { BiPlus } from "react-icons/bi";
import { Contact, Mail } from "@/app/interface";
import { CgClose } from "react-icons/cg";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import "react-quill-new/dist/quill.snow.css";
import { Button, Header, InputComponent, RichTextEditor } from "c4cui";
import { useMail } from "../MailContext";

export default function Compose() {
  const { id } = useParams();
  const [recipientsQuery, setRecipientsQuery] = useState("");
  const [ccQuery, setCcQuery] = useState("");
  const [bccQuery, setBccQuery] = useState("");
  const [ccSuggestions, setCcSuggestions] = useState<Contact[]>([]);
  const [recipientsSuggestions, setRecipientsSuggestions] = useState<Contact[]>([]);
  const [bccSuggestions, setBccSuggestions] = useState<Contact[]>([]);
  const [draft, setDraft] = useState<Partial<Mail>>({
    recipients: [],
    cc: [],
    bcc: [],
    subject: "",
    body: "",
  });
  const [savedDraft, setSavedDraft] = useState<Partial<Mail>>();
  const [ccInput, setCcInput] = useState(false);
  const [bccInput, setBccInput] = useState(false);
  const [sending, setSending] = useState(false);
  const [drafting, setDrafting] = useState(false);
  const [fetching, setFetching] = useState(false);
  const navigate = useNavigate();
  const { createMail, deleteMail, getContacts, getMail } = useMail();

  useEffect(() => {
    if (id) {
      handleGetDraftMail(parseInt(atob(id)));
    } else {
      navigate("/mail/compose");
    }
  }, [id]);

  useEffect(() => {
    autoSaveDraft();
  }, [draft]);

  const autoSaveDraft = async () => {
    if (!drafting && JSON.stringify(draft) !== JSON.stringify(savedDraft)) {
      setDrafting(true);
      if ((draft.recipients && draft.recipients.length > 0) || draft.subject?.trim() || draft.body?.trim()) {
        const res = await createMail({
          id: draft.id || (id && parseInt(atob(id))) || undefined,
          recipients: draft.recipients,
          cc: draft.cc,
          bcc: draft.bcc,
          subject: draft.subject?.trim(),
          body: draft.body?.trim(),
          is_draft: true,
        });
        if (res.mail) {
          setDraft({ ...draft, id: res.mail.id });
          setSavedDraft({ ...draft, id: res.mail.id });
        }
      } else if (draft.id) {
        const res = await deleteMail(draft.id);
        if (res.ok) {
          setDraft({
            recipients: [],
            cc: [],
            bcc: [],
            subject: "",
            body: "",
          });
          setSavedDraft({
            recipients: [],
            cc: [],
            bcc: [],
            subject: "",
            body: "",
          });
        }
      }
      setDrafting(false);
    }
  };

  const handleInputChange = async (query: string, setSuggestions: (contacts: Contact[]) => void) => {
    if (query.trim()) {
      const res = await getContacts(query);
      if (res.contacts) {
        setSuggestions(res.contacts);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleGetDraftMail = async (id: number) => {
    setFetching(true);
    const res = await getMail(id);
    if (res.mail) {
      setDraft(res.mail);
      setSavedDraft(res.mail);
    } else if (res.error === "404") {
      navigate("/mail/compose");
    } else {
      toast.error(res.error || "Failed to fetch draft. Please try again.");
    }
    setFetching(false);
  };

  const handleAddContact = async (query: string, type: "recipients" | "cc" | "bcc") => {
    if (query.trim() && !draft[type]?.includes(query.trim())) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(query.trim())) {
        setDraft((prev) => ({
          ...prev,
          [type]: [...(prev[type] || []), query.trim()],
        }));
        if (type === "recipients") setRecipientsQuery("");
        if (type === "cc") setCcQuery("");
        if (type === "bcc") setBccQuery("");
      } else {
        toast.error("Invalid email address.");
      }
    } else {
      if (type === "recipients") setRecipientsQuery("");
      if (type === "cc") setCcQuery("");
      if (type === "bcc") setBccQuery("");
    }
  };

  const handleRemoveContact = (field: "recipients" | "cc" | "bcc", contact: string) => {
    if (draft[field]?.includes(contact)) {
      setDraft((prev) => ({
        ...prev,
        [field]: prev[field]?.filter((item) => item !== contact),
      }));
    }
  };

  const handleSend = async () => {
    setSending(true);
    if (recipientsQuery) await handleAddContact(recipientsQuery, "recipients");
    if (ccQuery) await handleAddContact(ccQuery, "cc");
    if (bccQuery) await handleAddContact(bccQuery, "bcc");

    if (!draft.recipients) {
      toast.error("Enter atleast one recipient.");
    } else if (!draft.body?.trim()) {
      toast.error("Write a message.");
    } else {
      const res = await createMail({
        id: draft.id || (id && parseInt(atob(id))) || undefined,
        recipients: draft.recipients,
        cc: draft.cc,
        bcc: draft.bcc,
        subject: draft.subject,
        body: draft.body,
      });
      if (res.mail) {
        setDraft({
          recipients: [],
          cc: [],
          bcc: [],
          subject: "",
          body: "",
        });
        setSavedDraft({
          recipients: [],
          cc: [],
          bcc: [],
          subject: "",
          body: "",
        });
        toast.success("Email sent successfully!");
      } else {
        toast.error(res.error || "Failed to send email. Please try again.");
      }
    }
    setSending(false);
  };

  return (
    <div className="flex flex-col gap-8 rounded-xl grow p-4 overflow-y-auto">
      <Header title="Compose" />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-4">
            {draft.recipients?.map((contact) => (
              <div key={contact} className="flex items-center gap-2">
                <span>{contact}</span>
                <Button
                  onClick={() => handleRemoveContact("recipients", contact)}
                  icon={<CgClose size={18} />}
                  className="p-2 rounded-full border-none"
                  outline={true}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-4">
            <InputComponent
              type="email"
              placeholder="Recipients"
              inputClasses="rounded-xl"
              value={recipientsQuery.toLocaleLowerCase().trim()}
              onChange={(query) => {
                setRecipientsQuery(query);
                handleInputChange(query, setRecipientsSuggestions);
              }}
              suggestions={recipientsSuggestions.map((suggestion) => ({
                id: suggestion.email,
                value: suggestion.name,
              }))}
              onSelectSuggestion={(contact) => {
                handleAddContact(contact, "recipients");
                setRecipientsQuery("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "," || e.key === " ") {
                  e.preventDefault();
                  handleAddContact(recipientsQuery, "recipients");
                }
              }}
            />
            {!ccInput && (
              <Button
                onClick={() => setCcInput(true)}
                icon={<BiPlus size={18} />}
                label="Add CC"
                outline={true}
                className="p-2 border-none"
              />
            )}
            {!bccInput && (
              <Button
                onClick={() => setBccInput(true)}
                icon={<BiPlus size={18} />}
                label="Add BCC"
                outline={true}
                className="p-2 border-none"
              />
            )}
          </div>
        </div>

        {ccQuery || ccInput || (draft.cc && draft.cc?.length > 0) ? (
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-4">
              {draft.cc?.map((contact) => (
                <div key={contact} className="flex items-center gap-2">
                  <span>{contact}</span>
                  <Button
                    onClick={() => handleRemoveContact("cc", contact)}
                    icon={<CgClose size={18} />}
                    className="p-2 rounded-full border-none"
                    outline={true}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <InputComponent
                type="email"
                placeholder="CC"
                inputClasses="rounded-xl"
                value={ccQuery.toLocaleLowerCase().trim()}
                onChange={(query) => {
                  setCcQuery(query);
                  handleInputChange(query, setCcSuggestions);
                }}
                suggestions={ccSuggestions.map((suggestion) => ({
                  id: suggestion.email,
                  value: suggestion.name,
                }))}
                onSelectSuggestion={(contact) => {
                  handleAddContact(contact, "cc");
                  setCcQuery("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === "," || e.key === " ") {
                    e.preventDefault();
                    handleAddContact(ccQuery, "cc");
                  }
                }}
              />
              <Button
                onClick={() => {
                  setCcInput(false);
                  setDraft((prev) => ({
                    ...prev,
                    cc: [],
                  }));
                }}
                icon={<CgClose size={18} />}
                outline={true}
                className="border-none"
              />
            </div>
          </div>
        ) : null}

        {bccQuery || bccInput || (draft.bcc && draft.bcc?.length > 0) ? (
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-4">
              {draft.bcc?.map((contact) => (
                <div key={contact} className="flex items-center gap-2">
                  <span>{contact}</span>
                  <Button
                    onClick={() => handleRemoveContact("bcc", contact)}
                    icon={<CgClose size={18} />}
                    className="p-2 rounded-full border-none"
                    outline={true}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <InputComponent
                type="email"
                placeholder="BCC"
                value={bccQuery.toLocaleLowerCase().trim()}
                inputClasses="rounded-xl"
                onChange={(query) => {
                  setBccQuery(query);
                  handleInputChange(query, setBccSuggestions);
                }}
                suggestions={bccSuggestions.map((suggestion) => ({
                  id: suggestion.email,
                  value: suggestion.name,
                }))}
                onSelectSuggestion={(contact) => {
                  handleAddContact(contact, "bcc");
                  setBccQuery("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === "," || e.key === " ") {
                    e.preventDefault();
                    handleAddContact(bccQuery, "bcc");
                  }
                }}
              />
              <Button
                onClick={() => {
                  setBccInput(false);
                  setDraft((prev) => ({
                    ...prev,
                    bcc: [],
                  }));
                }}
                icon={<CgClose size={18} />}
                outline={true}
                className="border-none"
              />
            </div>
          </div>
        ) : null}

        <InputComponent
          placeholder="Subject"
          inputClasses="rounded-xl"
          value={draft.subject}
          onChange={(e) => setDraft({ ...draft, subject: e })}
        />
        <RichTextEditor value={draft.body || ""} onChange={(value) => setDraft({ ...draft, body: value })} />
        <Button disabled={sending} onClick={handleSend} label="Send" className="ml-auto" />
      </div>
    </div>
  );
}
