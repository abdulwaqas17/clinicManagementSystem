import api from "./api";

export const getDoctorBookedSlots = async (doctorId, token) => {
  try {
    const response = await api.get(`/appointments/booked-slots/${doctorId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Booked slots fetched:", response.data);
    return response.data.data; // array of appointments
  } catch (error) {
    console.error("Error fetching booked slots:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch booked slots."
    );
  }
};
