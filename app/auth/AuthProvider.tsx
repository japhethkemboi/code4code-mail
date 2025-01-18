import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Profile } from "../../../mail/app/interface";
import { toast } from "react-toastify";
import { fetchConfig } from "../fetchConfig";

type AuthContextType = {
  access: string | null;
  refresh: string | null;
  profile: Partial<Profile> | null;
  login: (credentials: { username: string; password: string }) => Promise<{
    ok?: boolean;
    error?: string;
  }>;
  signup: (user: {
    username: string;
    first_name: string;
    last_name?: string;
    password: string;
    phone_number?: string;
    organization?: number;
  }) => Promise<{ profile?: Profile; error?: string }>;
  refreshAccessToken: () => void;
  fetchProfile: () => void;
  logout: () => void;
  authFetch: (
    url: string,
    options?: RequestInit
  ) => Promise<{
    data?: any;
    error?: string;
    status: number;
  }>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [access, setAccess] = useState<string | null>(localStorage.getItem("access"));
  const [refresh, setRefresh] = useState<string | null>(localStorage.getItem("refresh"));
  const [profile, setProfile] = useState<Partial<Profile> | null>(null);
  let refreshPromise: Promise<{ access?: string; status?: number; error?: string }>;

  useEffect(() => {
    if (access) {
      fetchProfile();
    }
  }, []);

  const updateTokens = (newAccess: string, newRefresh: string) => {
    localStorage.setItem("access", newAccess);
    localStorage.setItem("refresh", newRefresh);
    setAccess(newAccess);
    setRefresh(newRefresh);
  };

  const fetchProfile = async () => {
    const res = await authFetch("/user/manage/", {
      method: "GET",
    });

    if (res.data) {
      setProfile(res.data);
    } else {
      toast.error(res.error || "Couldn't fetch your profile.");
    }
  };

  const signup = async (user: {
    username: string;
    first_name: string;
    last_name?: string;
    password: string;
    phone_number?: string;
    organization?: number;
  }): Promise<{ profile?: Profile; error?: string }> => {
    const res = await fetchConfig("/user/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (res.data) {
      return { profile: res.data };
    } else {
      return { error: res.error || "Couldn't sign you up. Try again." };
    }
  };

  const login = async (credentials: {
    username: string;
    password: string;
  }): Promise<{
    ok?: boolean;
    error?: string;
  }> => {
    const res = await fetchConfig("/user/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (res.data) {
      updateTokens(res.data.access, res.data.refresh);
      return { ok: true };
    } else {
      return { error: res.error || "Couldn't log you in. Try again." };
    }
  };

  const logout = async () => {
    if (access) {
      const res = await fetchConfig("/user/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      if (res.error && res.status !== 401) {
        toast.error(res.error || "Logout failed. Please try again.");
      } else {
        localStorage.clear();
        setAccess(null);
        setRefresh(null);
        setProfile(null);
      }
    } else {
      localStorage.clear();
      setAccess(null);
      setRefresh(null);
      setProfile(null);
    }
  };
  const refreshAccessToken = async (): Promise<{ access?: string; status?: number; error?: string }> => {
    if (!refreshPromise) {
      refreshPromise = new Promise(async (resolve) => {
        const res = await fetchConfig("/user/token/refresh/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh }),
        });

        if (res.data) {
          updateTokens(res.data.access, res.data.refresh);
          resolve({ access: res.data.access });
        } else {
          resolve({ error: res.error || "Something went wrong", status: res.status || 0 });
        }
      });
    }
    return refreshPromise;
  };

  const authFetch = async (
    url: string,
    options?: RequestInit
  ): Promise<{ data?: any; error?: string; status: number }> => {
    const res = await fetchConfig(url, {
      ...options,
      headers: {
        ...options?.headers,
        "Content-Type": "application/json",
        Authorization: `Bearer ${access}`,
      },
    });

    if (res.status !== 401) {
      return res;
    } else {
      if (refresh) {
        const newAccess = await refreshAccessToken();
        if (newAccess.access) {
          const newRes = await fetchConfig(url, {
            ...options,
            headers: {
              ...options?.headers,
              "Content-Type": "application/json",
              Authorization: `Bearer ${newAccess.access}`,
            },
          });
          if (res.status !== 401) {
            return newRes;
          }
        }
      }
      logout();
      return { error: "Your session has expired. Please login.", status: res.status || 0 };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        access,
        refresh,
        profile,
        fetchProfile,
        login,
        signup,
        refreshAccessToken,
        logout,
        authFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
