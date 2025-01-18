import React, { createContext, useContext, useEffect, useState } from "react";
import { Organization, Profile } from "../interface";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthProvider";
import { fetchConfig } from "../fetchConfig";

interface ConsoleContextType {
  organization: Organization | null;
  users: Partial<Profile>[] | null;
  verifyDomain: (domain: string) => Promise<{ ok?: boolean; error?: string }>;
  createOrganization: (organization: Partial<Organization>) => Promise<{ organization?: Organization; error?: string }>;
  getOrganization: (id: number) => Promise<{ organization?: Organization; error?: string }>;
}

const ConsoleContext = createContext<ConsoleContextType | undefined>(undefined);

// Provider component
export const ConsoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authFetch, access } = useAuth();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [users, setUsers] = useState<Partial<Profile>[] | null>(null);

  useEffect(() => {
    if (access) {
      fetchOrganization();
      fetchUsers();
    }
  }, [access]);

  const fetchOrganization = async (): Promise<void> => {
    const res = await authFetch(`/organization/manage/`);

    if (res.data) {
      setOrganization(res.data);
    } else {
      toast.error(res.error || "Couln't fetch organization details.");
    }
  };

  const fetchUsers = async (): Promise<void> => {
    const res = await authFetch(`/organization/users/`);

    if (res.data) {
      setUsers(res.data);
    } else {
      toast.error(res.error || "Couln't fetch organization members.");
    }
  };

  const getOrganization = async (id: number): Promise<{ organization?: Organization; error?: string }> => {
    const res = await fetchConfig(`/organization/${id}/`);
    if (res.data) {
      return { organization: res.data };
    } else {
      return { error: res.error };
    }
  };

  const getUsers = async (organization: number): Promise<{ users?: Profile[]; error?: string }> => {
    const res = await authFetch(`/organization/${organization}/users/`);

    if (res.data) {
      return { users: res.data };
    } else {
      return { error: res.error };
    }
  };

  const verifyDomain = async (domain: string): Promise<{ ok?: boolean; error?: string }> => {
    const res = await fetchConfig(`/domain/verify/?domain=${domain}`);

    if (res.status === 404) {
      return { error: res.error };
    } else if (res.status === 200) {
      return { ok: true };
    }
    return { error: res.error || "Unknown error occurred during verification." };
  };

  const createOrganization = async (
    organization: Partial<Organization>
  ): Promise<{ organization?: Organization; error?: string }> => {
    const res = await fetchConfig("/organization/create/", {
      method: "POST",
      body: JSON.stringify(organization),
    });

    if (res.status === 201 && res.data) {
      return { organization: res.data };
    } else {
      return { error: res.error };
    }
  };

  return (
    <ConsoleContext.Provider
      value={{
        organization,
        users,
        verifyDomain,
        getOrganization,
        createOrganization,
      }}
    >
      {children}
    </ConsoleContext.Provider>
  );
};

export const useConsole = () => {
  const context = useContext(ConsoleContext);

  if (!context) {
    throw new Error("useConsole must be used within a ConsoleProvider");
  }

  return context;
};
