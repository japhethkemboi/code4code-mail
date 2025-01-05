export const fetchConfig = async (
  url: string,
  options: RequestInit
): Promise<{
  data?: any;
  error?: string;
  status: number;
}> => {
  try {
    let newUrl = url;
    try {
      new URL(url);
    } catch (error) {
      newUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}${url}`;
    }
    const response = await fetch(newUrl, options);
    const responseData = await response.json();

    if (response.ok) {
      return { data: responseData, status: response.status };
    }

    return {
      error: responseData?.error || responseData?.detail || responseData?.details || "An error occurred.",
      status: response.status,
    };
  } catch (error: any) {
    return {
      error: error.message || "A network error occurred.",
      status: 0,
    };
  }
};
