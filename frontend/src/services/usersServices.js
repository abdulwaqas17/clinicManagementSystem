import api from "./api";


// confirm invite service
export const confirmInvite = async (id, password) => {
  try {
    const response = await api.post(`/users/confirm/${id}`, { password });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to confirm invitation. Please try again.");
    }
  }
};



// invite user service
export const inviteUser = async (data, token) => {
  try {
    const formData = new FormData();

    // append all normal fields
    for (const key in data) {
      if (data[key] !== null && data[key] !== undefined) {
       if (key === "doctorInfo" && typeof data[key] === "object") {
  formData.append("doctorInfo", JSON.stringify(data[key]));
}
 else {
          formData.append(key, data[key]);
        }
      }
    }

    console.log('=================formData===================');
    console.log(formData);
    console.log('=================formData===================');

    const response = await api.post("/users/invite", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to invite user. Please try again.");
    }
  }
};


// update user service
export const updateUserProfile = async (userId, formData, token) => {
  try {
    const response = await api.put(`/users/update/${userId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Profile updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error.response?.data || error);
    throw error.response?.data || { message: "Failed to update profile" };
  }
};