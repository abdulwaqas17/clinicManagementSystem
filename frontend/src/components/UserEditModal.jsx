"use client";

import { useRoomContext } from "@/context/roomContext";
import { updateUserProfile } from "@/services/usersServices";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const EditUserModal = ({
  onClose,
  role,
  selectedUser,
  setUsers,
  setDoctors,
  setReceptionists,
}) => {
  const { rooms } = useRoomContext();

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

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
      schedule: [{ day: "Monday", startTime: "09:00", endTime: "15:00" }],
    },
  });
   const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Prefill user data when editing
  useEffect(() => {
    if (selectedUser) {
      setFormData((prev) => ({
        ...prev,
        ...selectedUser,
        doctorInfo: selectedUser.doctorInfo || prev.doctorInfo,
      }));
    }
  }, [selectedUser]);

  // Common input change handler
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

  // Handle schedule change
  const handleScheduleChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedSchedule = [...prev.doctorInfo.schedule];
      updatedSchedule[index][field] = value;
      return {
        ...prev,
        doctorInfo: {
          ...prev.doctorInfo,
          schedule: updatedSchedule,
        },
      };
    });
  };

  // Add new schedule slot
  const addScheduleRow = () => {
    setFormData((prev) => ({
      ...prev,
      doctorInfo: {
        ...prev.doctorInfo,
        schedule: [
          ...prev.doctorInfo.schedule,
          { day: "Saturday", startTime: "09:00", endTime: "15:00" },
        ],
      },
    }));
  };

  // Remove schedule slot
  const removeScheduleRow = (index) => {
    setFormData((prev) => {
      const updatedSchedule = prev.doctorInfo.schedule.filter(
        (_, i) => i !== index
      );
      return {
        ...prev,
        doctorInfo: { ...prev.doctorInfo, schedule: updatedSchedule },
      };
    });
  };

  // Handle file input
  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, profileImage: e.target.files[0] }));
  };

  //  Validate before submit
  const validateForm = () => {
    if (
      !formData.firstName ||
      !formData.email ||
      !formData.phone ||
      !formData.gender ||
      !formData.date_of_birth ||
      !formData.address
    ) {
      toast.error("Please fill all required fields!");
      return false;
    }

    if (role === "doctor") {
      const { specialization, doctorRoom, schedule, consultationFee } =
        formData.doctorInfo;
      if (!specialization || !doctorRoom || !consultationFee) {
        toast.error("Please fill doctor-specific fields!");
        return false;
      }

      //  Validate schedule
      for (let i = 0; i < schedule.length; i++) {
        const { day, startTime, endTime } = schedule[i];
        if (!day || !startTime || !endTime) {
          toast.error(`Please fill day, start and end time for slot #${i + 1}`);
          return false;
        }
      }
    }

    return true;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication token missing. Please log in again.");
      router.push("/login");
      return;
    }
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "doctorInfo" && typeof formData[key] === "object") {
        data.append("doctorInfo", JSON.stringify(formData[key]));
      } else {
        data.append(key, value);
      }
    });

    try {
      setLoading(true);
      const res = await updateUserProfile(selectedUser?._id, data, token);
      toast.success("User updated successfully!");

      console.log("===================res=================");
      console.log(res);
      console.log("===================res=================");

      if (role === "doctor")
        setDoctors((prev) => prev.map((d) => (d._id === res._id ? res : d)));
      else if (role === "receptionist")
        setReceptionists((prev) =>
          prev.map((r) => (r._id === res._id ? res : r))
        );
      else setUsers((prev) => prev.map((u) => (u._id === res._id ? res : u)));

      onClose();
    } catch (error) {
      toast.error(error?.message || "Update failed!");
    } finally {
      setLoading(false);
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
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="border p-2 rounded"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="border p-2 rounded"
              required
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth?.split("T")[0]}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="border p-2 rounded col-span-2"
              required
            />
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border p-2 rounded col-span-2"
            >
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
            </select>
            <input
              type="file"
              name="profileImage"
              onChange={handleFileChange}
              className="col-span-2"
            />
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
                    <option key={room._id} value={room._id}>
                      {room.name}
                    </option>
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

              {/* Doctor Schedule Section */}
              <h4 className="mt-5 font-semibold">Schedule</h4>
              <div className="space-y-3">
                {formData.doctorInfo.schedule.map((slot, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <select
                      value={slot.day}
                      onChange={(e) =>
                        handleScheduleChange(index, "day", e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Select Day</option>
                      {daysOfWeek.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>

                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) =>
                        handleScheduleChange(index, "startTime", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    />

                    <span className="text-gray-500 text-sm">to</span>

                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) =>
                        handleScheduleChange(index, "endTime", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    />

                    <button
                      type="button"
                      onClick={() => removeScheduleRow(index)}
                      disabled={formData.doctorInfo.schedule.length === 1}
                      className="p-2 text-red-600 hover:text-red-700 disabled:text-gray-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addScheduleRow}
                className="flex items-center gap-2 mt-3 text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-4 h-4" /> Add Slot
              </button>
            </div>
          )}

          <div className="flex justify-end mt-5 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {loading ? "Updating..." : "Update User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
