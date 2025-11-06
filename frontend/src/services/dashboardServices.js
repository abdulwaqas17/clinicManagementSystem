import api from "./api";

export const getDashboardData = async (token) => {
  try {

    const response = await api.get("/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('================dash response====================');
    console.log(response);
    console.log('================dash response====================');
    return response.data.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to fetch dashboard data. Please try again.");
    }
  }
};
