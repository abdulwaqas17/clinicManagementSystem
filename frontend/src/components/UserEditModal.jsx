"use client";

import { useRoomContext } from "@/context/roomContext";
import { updateUserProfile } from "@/services/usersServices";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const EditUserModal = ({
  onClose,
  role,
  selectedUser,
  setUsers,
  setDoctors,
  setReceptionists,
}) => {
  const { rooms } = useRoomContext();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    date_of_birth: "",
    address: "",
    status: "active",
    profileImage: null,
    doctorInfo: {
      specialization: "",
      doctorRoom: "",
      experience: "",
      consultationFee: "",
      schedule: [{ day: "", startTime: "", endTime: "" }],
    },
  });

  console.log('==============selectedUser======================');
  console.log(selectedUser);
  console.log('==============selectedUser======================');

  // 📌 prefill fields for editing
  useEffect(() => {
    if (selectedUser) {
      setFormData((prev) => ({
   
        ...selectedUser,
        doctorInfo: selectedUser.doctorInfo || prev.doctorInfo,
      }));
    }
  }, [selectedUser]);

  

  // handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("doctorInfo.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        doctorInfo: { ...prev.doctorInfo, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // handle image
  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, profileImage: e.target.files[0] }));
  };

  // validation before submit
  const validateForm = () => {
    if (!formData.firstName || !formData.email || !formData.phone || !formData.gender || !formData.date_of_birth || !formData.address) {
      toast.error("Please fill all required fields!");
      return false;
    }
    if (role === "doctor") {
      if (!formData.doctorInfo.specialization || !formData.doctorInfo.doctorRoom) {
        toast.error("Please fill doctor-specific fields!");
        return false;
      }
    }
    return true;
  };

  

  // submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "doctorInfo") {
        Object.entries(value).forEach(([dKey, dVal]) => {
          data.append(`doctorInfo.${dKey}`, dVal);
        });
      } else {
        data.append(key, value);
      }
    });

    try {
      const res = await updateUserProfile(selectedUser?._id, data, token);
      toast.success("User updated successfully!");

      if (role === "doctor") setDoctors((prev) => prev.map((d) => d._id === res._id ? res : d));
      else if (role === "receptionist") setReceptionists((prev) => prev.map((r) => r._id === res._id ? res : r));
      else setUsers((prev) => prev.map((u) => u._id === res._id ? res : u));

      onClose();
    } catch (error) {
      toast.error(error?.message || "Update failed!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-[600px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {selectedUser ? "Edit User" : "Add New User"} ({role})
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Common Fields */}
          <div className="grid grid-cols-2 gap-3">
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="border p-2 rounded" required />
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="border p-2 rounded" />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded" required />
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="border p-2 rounded" required />
            <select name="gender" value={formData.gender} onChange={handleChange} className="border p-2 rounded" required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <input type="date" name="date_of_birth" value={formData.date_of_birth?.split("T")[0]} onChange={handleChange} className="border p-2 rounded" required />
            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="border p-2 rounded col-span-2" required />
            <select name="status" value={formData.status} onChange={handleChange} className="border p-2 rounded col-span-2">
              <option value="active">Active</option>
              <option value="invited">Invited</option>
              <option value="disabled">Disabled</option>
            </select>
            <input type="file" name="profileImage" onChange={handleFileChange} className="col-span-2" />
          </div>

          {/* Doctor Fields */}
          {role === "doctor" && (
            <div className="mt-4 border-t pt-4">
              <h3 className="font-semibold mb-2">Doctor Information</h3>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="doctorInfo.specialization"
                  value={formData.doctorInfo.specialization}
                  onChange={handleChange}
                  placeholder="Specialization"
                  className="border p-2 rounded"
                  required
                />
                <select
                  name="doctorInfo.doctorRoom"
                  value={formData.doctorInfo.doctorRoom}
                  onChange={handleChange}
                  className="border p-2 rounded"
                  required
                >
                  <option value="">Select Room</option>
                  {rooms?.map((room) => (
                    <option key={room._id} value={room._id}>{room.roomNumber}</option>
                  ))}
                </select>
                <input
                  type="number"
                  name="doctorInfo.experience"
                  value={formData.doctorInfo.experience}
                  onChange={handleChange}
                  placeholder="Experience (years)"
                  className="border p-2 rounded"
                />
                <input
                  type="number"
                  name="doctorInfo.consultationFee"
                  value={formData.doctorInfo.consultationFee}
                  onChange={handleChange}
                  placeholder="Consultation Fee"
                  className="border p-2 rounded"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end mt-5 gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
