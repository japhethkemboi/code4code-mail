import React, { createContext, useContext, useEffect, useState } from "react";
import { Organization, User } from "../interface";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthProvider";
import { getOrganization, getOrganizationMembers } from "./organization/utils";

interface GlobalContextType {
  organization: Organization | null;
  setOrganization: (organization: Organization | null) => void;
  handleGetOrganization: () => void;
  organizationMembers: Partial<User>[] | null;
  handleGetOrganizationMembers: () => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// Provider component
export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, accessToken } = useAuth();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [organizationMembers, setOrganizationMembers] = useState<Partial<User>[] | null>(null);

  useEffect(() => {
    handleGetOrganization();
    handleGetOrganizationMembers();
  }, [user]);

  const handleGetOrganization = async (): Promise<void> => {
    if (user?.organization && accessToken) {
      const res = await getOrganization(user.organization, accessToken);

      if (res.organization) {
        setOrganization(res.organization);
      } else {
        toast.error("Couln't fetch organization details.");
      }
    }
  };

  const handleGetOrganizationMembers = async (): Promise<void> => {
    if (user?.organization && accessToken) {
      const res = await getOrganizationMembers(user.organization, accessToken);

      if (res.members) {
        setOrganizationMembers(res.members);
      } else {
        toast.error(res.error || "Couln't fetch organization members.");
      }
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        organization,
        setOrganization,
        organizationMembers,
        handleGetOrganization,
        handleGetOrganizationMembers,
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
