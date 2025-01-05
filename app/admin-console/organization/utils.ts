import { fetchConfig } from "@/app/fetchConfig";
import { Organization, User } from "@/app/interface";

export const getOrganization = async (
  id: number,
  accessToken?: string
): Promise<{ organization?: Organization; error?: string }> => {
  try {
    const res = await fetchConfig(`/organization/${id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (res.status === 200) {
      return { organization: res.data };
    } else if (res.status === 401) {
      return { error: "Unauthorized" };
    } else {
      return { error: res.data.error };
    }
  } catch (error: any) {
    return { error: error.message || "Something went wrong." };
  }
};

export const getOrganizationMembers = async (
  organization: number,
  accessToken?: string
): Promise<{ members?: User[]; error?: string }> => {
  try {
    const res = await fetchConfig(`/organization/${organization}/members/`, {
      method: "GET",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (res.status === 200) {
      return { members: res.data.members };
    } else if (res.status === 401) {
      return { error: "Unauthorized" };
    } else {
      return { error: res.data.error };
    }
  } catch (error: any) {
    return { error: error.message || "Something went wrong." };
  }
};
