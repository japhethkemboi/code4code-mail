export const fetchConfig = async (
  url: string,
  options: RequestInit = {}
): Promise<{
  data?: any;
  error?: string;
  status: number;
}> => {
  try {
    let newUrl = url;

    try {
      new URL(url);
    } catch {
      newUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}${url}`;
    }

    if (!options.method) {
      options.method = "GET";
    }

    options.headers = {
      ...options.headers,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const response = await fetch(newUrl, options);

    try {
      const responseData = await response.json();
      if (response.ok) {
        return { data: responseData, status: response.status };
      }
      return {
        error: responseData?.error || responseData?.detail || responseData?.details || "An error occurred.",
        status: response.status,
      };
    } catch {
      if (response.ok) {
        return { status: response.status };
      }
      return {
        error: "An error occurred.",
        status: response.status,
      };
    }
  } catch {
    return {
      error: "A network error occurred.",
      status: 0,
    };
  }
};
