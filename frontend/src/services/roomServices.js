import api from "./api";

export const createRoom = async (roomData, token) => {
  try {
    const response = await api.post("/rooms", roomData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating room:", error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to create room. Please try again.");
    }
  }
};
