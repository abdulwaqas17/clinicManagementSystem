import api from "./api";

// Create a new room
export const createRoom = async (roomData, token) => {
  try {
    const response = await api.post("/rooms/create", roomData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('=================room response===================');
    console.log(response);
    console.log('=================room response===================');
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

// Update Room
export const updateRoom = async (roomId, roomData, token) => {
  try {
    const response = await api.put(`/rooms/update/${roomId}`, roomData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating room:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to update room. Please try again."
    );
  }
};
