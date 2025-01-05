import { User } from "../interface";

// export const getUser = async (accessToken: string): Promise<{ user?: User; error?: string }> => {
//   try {
//     const res = await fetchInstance(`/user/`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "multipart/form-data",
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     if (res.status === 200) {
//       return { user: res.data.user };
//     } else if (res.status === 401) {
//       return { error: "Unauthorized" };
//     } else {
//       return { error: res.data.error };
//     }
//   } catch (error: any) {
//     return { error: error.message || "Something went wrong." };
//   }
// };
