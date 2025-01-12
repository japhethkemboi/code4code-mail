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
