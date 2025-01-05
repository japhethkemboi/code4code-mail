import React, { createContext, useContext, useEffect, useState } from "react";
import { Mail } from "../interface";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthProvider";

interface GlobalContextType {
  inbox: Mail[] | null;
  setInbox: (inbox: Mail[] | null) => void;
  sent: Mail[] | null;
  setSent: (sent: Mail[] | null) => void;
  drafts: Mail[] | null;
  setDrafts: (drafts: Mail[] | null) => void;
  handleGetInbox: () => void;
  handleGetDrafts: () => void;
  handleGetSent: () => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// Provider component
export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inbox, setInbox] = useState<Mail[] | null>(null);
  const [sent, setSent] = useState<Mail[] | null>(null);
  const [drafts, setDrafts] = useState<Mail[] | null>(null);
  const { access, authFetch } = useAuth();

  useEffect(() => {
    handleGetInbox();
    handleGetSent();
    handleGetDrafts();
  }, []);

  const handleGetInbox = async (): Promise<void> => {
    const res = await authFetch("/mail/inbox/", {
      method: "GET",
    });

    if (res.data) {
      setInbox(res.data);
    } else {
      toast.error(res.error || "Couln't fetch inbox mails.");
    }
  };

  const handleGetSent = async (): Promise<void> => {
    const res = await authFetch("/mail/sent/", {
      method: "GET",
    });

    if (res.data) {
      setSent(res.data);
    } else {
      toast.error(res.error || "Couln't fetch sent mails.");
    }
  };

  const handleGetDrafts = async (): Promise<void> => {
    const res = await authFetch("/mail/drafts/", {
      method: "GET",
    });

    if (res.data) {
      setDrafts(res.data);
    } else {
      toast.error(res.error || "Couln't fetch drafts.");
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        inbox,
        setInbox,
        handleGetInbox,
        sent,
        setSent,
        drafts,
        setDrafts,
        handleGetSent,
        handleGetDrafts,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }

  return context;
};
