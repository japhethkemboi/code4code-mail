import React, { createContext, useContext, useEffect, useState } from "react";
import { Organization, Profile } from "../interface";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthProvider";
import { fetchConfig } from "../fetchConfig";

interface ConsoleContextType {
  organization: Organization | null;
  fetchOrganization: () => void;
  organizationMembers: Partial<Profile>[] | null;
  fetchOrganizationMembers: () => void;
  verifyDomain: (domain: string) => Promise<{ ok?: boolean; error?: string }>;
  createOrganization: (organization: Partial<Organization>) => Promise<{ organization?: Organization; error?: string }>;
  getOrganization: (id: number) => Promise<{ organization?: Organization; error?: string }>;
}

const ConsoleContext = createContext<ConsoleContextType | undefined>(undefined);

// Provider component
export const ConsoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, authFetch } = useAuth();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [organizationMembers, setOrganizationMembers] = useState<Partial<Profile>[] | null>(null);

  useEffect(() => {
    fetchOrganization();
    fetchOrganizationMembers();
  }, []);

  const fetchOrganization = async (): Promise<void> => {
    if (profile?.organization?.id) {
      const res = await authFetch(`/organization/${profile.organization.id}/manage/`);

      if (res.data) {
        setOrganization(res.data);
      } else {
        toast.error(res.error || "Couln't fetch organization details.");
      }
    }
  };

  const fetchOrganizationMembers = async (): Promise<void> => {
    if (organization?.id) {
      const res = await getOrganizationMembers(organization.id);

      if (res.members) {
        setOrganizationMembers(res.members);
      } else {
        toast.error(res.error || "Couln't fetch organization members.");
      }
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

  const getOrganizationMembers = async (organization: number): Promise<{ members?: Profile[]; error?: string }> => {
    const res = await authFetch(`/organization/${organization}/members/`);

    if (res.data) {
      return { members: res.data };
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
        organizationMembers,
        fetchOrganization,
        fetchOrganizationMembers,
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
