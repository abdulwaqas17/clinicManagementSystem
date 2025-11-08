import api from "./api";

export const createCaseHistory = async (data,token) => {
  try {
   
    const response = await api.post("/case-history/create", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
 if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Something went wrong. Please try again.");
    }
  }
};
