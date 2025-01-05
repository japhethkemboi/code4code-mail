import { fetchConfig } from "../fetchConfig";
import { Contact, Mail } from "../interface";

export const getMail = async (id: number, accessToken: string): Promise<{ mail?: Mail; error?: string }> => {
  try {
    const res = await fetchConfig(`/mail/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (res.status === 200) {
      return { mail: res.data };
    } else if (res.status === 404) {
      return { error: "404" };
    } else if (res.status === 401) {
      return { error: "Unauthorized" };
    } else {
      return { error: res.data.error };
    }
  } catch (error: any) {
    return { error: error.message || "Something went wrong." };
  }
};

export const deleteMail = async (id: number, accessToken: string): Promise<{ ok?: boolean; error?: string }> => {
  const res = await fetchConfig(`/mail/delete/${id}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (res.status === 204) {
    return { ok: true };
  } else if (res.status === 404) {
    return { error: "404" };
  } else if (res.status === 401) {
    return { error: "Unauthorized" };
  } else {
    return { error: res.error || "An unknown error occurred." };
  }
};

export const getSent = async (accessToken?: string): Promise<{ emails?: Mail[]; error?: string }> => {
  try {
    const res = await fetchConfig(`/mail/sent/`, {
      method: "GET",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (res.status === 200) {
      return { emails: res.data };
    } else if (res.status === 401) {
      return { error: "Unauthorized" };
    } else {
      return { error: res.data.error };
    }
  } catch (error: any) {
    return { error: error.message || "Something went wrong." };
  }
};

export const getDrafts = async (accessToken?: string): Promise<{ emails?: Mail[]; error?: string }> => {
  try {
    const res = await fetchConfig(`/mail/drafts/`, {
      method: "GET",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (res.status === 200) {
      return { emails: res.data };
    } else if (res.status === 401) {
      return { error: "Unauthorized" };
    } else {
      return { error: res.data.error };
    }
  } catch (error: any) {
    return { error: error.message || "Something went wrong." };
  }
};

export const getContacts = async (
  accessToken: string,
  query?: string
): Promise<{ contacts?: Contact[]; error?: string }> => {
  try {
    const res = await fetchConfig(`/contact/list/?query=${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (res.status === 200) {
      return { contacts: res.data };
    } else if (res.status === 401) {
      return { error: "Unauthorized" };
    } else {
      return { error: res.data.error };
    }
  } catch (error: any) {
    return { error: error.message || "Something went wrong." };
  }
};

export const createMail = async (
  mail: Partial<Mail>,
  accessToken: string
): Promise<{ mail?: Mail; error?: string }> => {
  try {
    const res = await fetchConfig("/mail/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(mail),
    });

    if (res.status === 201) {
      return { mail: res.data.mail };
    }
    return { error: res.data.error || "Failed. Please try again." };
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred during signup. Please try again." };
  }
};

export const formatDateRegionally = (string: string, locale?: string) => {
  const validLocale = typeof locale === "string" && locale.match(/^[a-z]{2}(-[A-Z]{2})?$/) ? locale : "en-US";

  const date = new Date(string);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const lastWeekStart = new Date(startOfWeek);
  lastWeekStart.setDate(startOfWeek.getDate() - 7);

  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();
  const isThisWeek = date >= startOfWeek && date < today;
  const isLastWeek = date >= lastWeekStart && date < startOfWeek;
  const isThisYear = date.getFullYear() === today.getFullYear();

  const timeOptions: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "numeric" };

  if (isToday) {
    return new Intl.DateTimeFormat(validLocale, timeOptions).format(date);
  } else if (isYesterday) {
    return `Yesterday, ${new Intl.DateTimeFormat(validLocale, timeOptions).format(date)}`;
  } else if (isThisWeek) {
    return `${new Intl.DateTimeFormat(validLocale, { weekday: "short" }).format(date)}, ${new Intl.DateTimeFormat(
      validLocale,
      timeOptions
    ).format(date)}`;
  } else if (isLastWeek || (isThisYear && date < startOfWeek)) {
    return `${new Intl.DateTimeFormat(validLocale, { month: "short", day: "numeric" }).format(
      date
    )}, ${new Intl.DateTimeFormat(validLocale, timeOptions).format(date)}`;
  } else {
    return `${new Intl.DateTimeFormat(validLocale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)}, ${new Intl.DateTimeFormat(validLocale, timeOptions).format(date)}`;
  }
};
