import api from "./api";


// Get booked slots for a doctor
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



// Book an appointment
export const bookAppointment = async (doctorId, date, timeSlot, token) => {
  try {

    console.log('==============book app======================');
    console.log(doctorId, date, timeSlot);
    console.log('==============book app======================');
    const response = await api.post(
      "/appointments/book",
      {
        doctor: doctorId,
        date,
        timeSlot,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Appointment booked:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error booking appointment:", error);
    throw new Error(
      error.response?.data?.message || "Failed to book appointment."
    );
  }
};


// Update an appointment
export const updateAppointmentService = async (appointmentId, data, token) => {
  try {
    const response = await api.put(`/appointments/edit/${appointmentId}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update appointment");
  }
};