import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { User } from "../interface";
import { toast } from "react-toastify";
import { fetchConfig } from "../fetchConfig";

type AuthContextType = {
  access: string | null;
  refresh: string | null;
  profile: Partial<User> | null;
  login: (credentials: { username: string; password: string }) => Promise<{
    ok?: boolean;
    error?: string;
  }>;
  signup: (user: User) => Promise<{ ok?: boolean; error?: string }>;
  refreshAccessToken: () => void;
  fetchProfile: () => void;
  logout: () => void;
  authFetch: (
    url: string,
    options: RequestInit
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
  const [profile, setProfile] = useState<Partial<User> | null>(null);
  let refreshPromise: Promise<string | false> | null = null;

  useEffect(() => {
    if (access) {
      fetchProfile();
    }
  }, [access]);

  const updateTokens = (newAccess: string, newRefresh: string) => {
    localStorage.setItem("access", newAccess);
    localStorage.setItem("refresh", newRefresh);
    setAccess(newAccess);
    setRefresh(newRefresh);
  };

  const fetchProfile = async () => {
    const res = await fetchConfig("/user/manage/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access}`,
      },
    });

    if (res.data) {
      setProfile(res.data);
    } else {
      toast.error(res.error || "Couldn't fetch your profile.");
    }
  };

  const signup = async (user: User): Promise<{ ok?: boolean; error?: string }> => {
    const res = await fetchConfig("/user/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (res.data) {
      return { ok: true };
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
    const res = await authFetch("/user/logout/", {
      method: "POST",
    });

    if (res.error && res.status !== 401) {
      toast.error(res.error || "Logout failed. Please try again.");
    } else {
      localStorage.clear();
      setAccess(null);
      setRefresh(null);
      setProfile(null);
    }
  };

  const refreshAccessToken = async (): Promise<string | false> => {
    if (!refreshPromise) {
      refreshPromise = new Promise(async (resolve, reject) => {
        const res = await fetchConfig("/user/token/refresh/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh }),
        });

        if (res.data) {
          updateTokens(res.data.access, res.data.refresh);
          resolve(res.data.access);
        } else {
          logout();
          resolve(false);
        }
      });
    }
    return refreshPromise;
  };

  const authFetch = async (
    url: string,
    options: RequestInit
  ): Promise<{ data?: any; error?: string; status: number }> => {
    const res = await fetchConfig(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${access}`,
      },
    });

    if (res.status === 401) {
      if (!refresh) {
        logout();
        return { error: "You are not logged in.", status: 401 };
      }

      const newAccess = await refreshAccessToken();
      if (newAccess) {
        const newRes = await fetchConfig(url, {
          ...options,
          headers: {
            ...options?.headers,
            Authorization: `Bearer ${newAccess}`,
          },
        });
        if (newRes.status === 401) {
          logout();
        } else {
          return newRes;
        }
      } else {
        return { error: "Your session has expired. Please log in again.", status: 401 };
      }
    }

    return res;
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
