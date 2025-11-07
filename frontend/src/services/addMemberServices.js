import api from "./api";

export const inviteReceptionist = async (data, token) => {
  try {
    const formData = new FormData();

    // Append fields
    for (const key in data) {
      if (data[key]) {
        formData.append(key, data[key]);
      }
    }

    const response = await api.post("/users/invite", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log('===============recept invite resposne=====================');
    console.log(response);
    console.log('===============recept invite resposne=====================');

    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to invite receptionist. Please try again.");
    }
  }
};
