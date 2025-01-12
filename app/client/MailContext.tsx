import React, { createContext, useContext, useEffect, useState } from "react";
import { Contact, Mail, Reply } from "../interface";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthProvider";

interface MailContextType {
  createMail: (mail: Partial<Mail>) => Promise<{ mail?: Mail; error?: string }>;
  getMail: (id: number) => Promise<{ mail?: Mail; error?: string }>;
  createReply: (reply: Partial<Reply>) => Promise<{ reply?: Reply; error?: string }>;
  getReply: (id: number) => Promise<{ reply?: Reply; error?: string }>;
  getReplies: (id: number) => Promise<{ replies?: Reply[]; error?: string }>;
  deleteMail: (id: number) => Promise<{ ok?: boolean; message: string }>;
  inbox: Mail[] | null;
  setInbox: (inbox: Mail[] | null) => void;
  sent: Mail[] | null;
  setSent: (sent: Mail[] | null) => void;
  drafts: Mail[] | null;
  setDrafts: (drafts: Mail[] | null) => void;
  getInbox: () => void;
  getDrafts: () => void;
  getSent: () => void;
  toggleArchive: (id: number, archived: boolean) => Promise<{ ok?: boolean; message?: string }>;
  toggleStar: (id: number, type: "mail" | "reply", starred: boolean) => Promise<{ ok?: boolean; error?: string }>;
  getContacts: (query: string) => Promise<{ contacts?: Contact[]; error?: string }>;
}

const MailContext = createContext<MailContextType | undefined>(undefined);

// Provider component
export const MailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inbox, setInbox] = useState<Mail[] | null>(null);
  const [sent, setSent] = useState<Mail[] | null>(null);
  const [drafts, setDrafts] = useState<Mail[] | null>(null);
  const { authFetch } = useAuth();

  useEffect(() => {
    getInbox();
    getSent();
    getDrafts();
  }, []);

  const createMail = async (mail: Partial<Mail>): Promise<{ mail?: Mail; error?: string }> => {
    const res = await authFetch("/mail/create/", {
      method: "POST",
      body: JSON.stringify(mail),
    });

    if (res.status === 201) {
      return { mail: res.data };
    }
    return { error: res.error || "Failed. Please try again." };
  };

  const getMail = async (id: number): Promise<{ mail?: Mail; error?: string }> => {
    const res = await authFetch(`/mail/manage/${id}`, { method: "GET" });
    if (res.data) {
      return { mail: res.data };
    } else {
      return { error: res.error || "An unknown error occurred." };
    }
  };

  const createReply = async (reply: Partial<Reply>): Promise<{ reply?: Reply; error?: string }> => {
    const res = await authFetch("/mail/reply/create/", {
      method: "POST",
      body: JSON.stringify(reply),
    });

    if (res.status === 201) {
      return { reply: res.data };
    }
    return { error: res.error || "Failed. Please try again." };
  };

  const getReply = async (id: number): Promise<{ reply?: Reply; error?: string }> => {
    const res = await authFetch(`/mail/reply/manage/${id}`, { method: "GET" });

    if (res.status === 200) {
      return { reply: res.data };
    }
    return { error: res.error || "Failed. Please try again." };
  };

  const getReplies = async (id: number): Promise<{ replies?: Reply[]; error?: string }> => {
    const res = await authFetch(`/mail/replies/${id}`, { method: "GET" });
    if (res.data) {
      return { replies: res.data };
    } else {
      return { error: res.error || "An unknown error occurred." };
    }
  };

  const getInbox = async (): Promise<void> => {
    const res = await authFetch("/mail/inbox/", { method: "GET" });

    if (res.data) {
      setInbox(res.data);
    } else {
      toast.error(res.error || "Couln't fetch inbox mails.");
    }
  };

  const getSent = async (): Promise<void> => {
    const res = await authFetch("/mail/sent/", { method: "GET" });

    if (res.data) {
      setSent(res.data);
    } else {
      toast.error(res.error || "Couln't fetch sent mails.");
    }
  };

  const getDrafts = async (): Promise<void> => {
    const res = await authFetch("/mail/drafts/", { method: "GET" });

    if (res.data) {
      setDrafts(res.data);
    } else {
      toast.error(res.error || "Couln't fetch drafts.");
    }
  };

  const toggleArchive = async (id: number, archived: boolean): Promise<{ ok?: boolean; message: string }> => {
    const res = await authFetch(`/mail/manage/${id}/`, {
      method: "PUT",
      body: JSON.stringify({ archived: !archived }),
    });

    if (res.status === 200) {
      return { ok: true, message: `Conversation ${archived ? "removed from archive" : "archived"}.` };
    } else {
      return { message: res.error || "An unknown error occurred." };
    }
  };

  const toggleStar = async (
    id: number,
    type: "mail" | "reply",
    starred: boolean
  ): Promise<{ ok?: boolean; error?: string }> => {
    const res = await authFetch(`/mail/${type === "reply" ? "reply/" : ""}manage/${id}/`, {
      method: "PUT",
      body: JSON.stringify({ starred: !starred }),
    });

    if (res.status === 200) {
      return { ok: true };
    } else {
      return { error: res.error || "An unknown error occurred." };
    }
  };

  const deleteMail = async (id: number): Promise<{ ok?: boolean; message: string }> => {
    const res = await authFetch(`/mail/manage/${id}/`, { method: "DELETE" });

    if (res.status === 204) {
      return { ok: true, message: "Mail was deleted." };
    } else if (res.status === 404) {
      return { ok: true, message: "Mail was already deleted." };
    } else {
      return { message: res.error || "An unknown error occurred." };
    }
  };

  const getContacts = async (query?: string): Promise<{ contacts?: Contact[]; error?: string }> => {
    const res = await authFetch(`/contact/list/?query=${query}`, { method: "GET" });
    if (res.data) {
      return { contacts: res.data };
    } else {
      return { error: res.error || "Something went wrong." };
    }
  };

  return (
    <MailContext.Provider
      value={{
        createMail,
        getMail,
        createReply,
        getReply,
        getReplies,
        deleteMail,
        inbox,
        setInbox,
        getInbox,
        sent,
        setSent,
        drafts,
        setDrafts,
        getSent,
        getDrafts,
        getContacts,
        toggleArchive,
        toggleStar,
      }}
    >
      {children}
    </MailContext.Provider>
  );
};

export const useMail = () => {
  const context = useContext(MailContext);

  if (!context) {
    throw new Error("useMail must be used within a MailProvider");
  }

  return context;
};
