"use client";

import { useDoctorContext } from "@/context/doctorContext";
import { inviteUser } from "@/services/usersServices";
import { useState } from "react";
import { toast } from "react-hot-toast";

export function AddUserModal({
  isOpen,
  onClose,
  role,
  receptionists,
  setReceptionists,
}) {
  
  const { doctors, setDoctors } = useDoctorContext();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    date_of_birth: "",
    address: "",
    profileImage: null,
    // doctor-specific fields
    specialization: "",
    doctorRoom: "",
    experience: "",
    consultationFee: "",
    schedule: [{ day: "", startTime: "", endTime: "" }],
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleScheduleChange = (index, field, value) => {
    const updatedSchedule = [...formData.schedule];
    updatedSchedule[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      schedule: updatedSchedule,
    }));
  };

  const addScheduleRow = () => {
    setFormData((prev) => ({
      ...prev,
      schedule: [...prev.schedule, { day: "", startTime: "", endTime: "" }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const payload =
        role === "doctor"
          ? {
              ...formData,
              role,
              doctorInfo: {
                specialization: formData.specialization,
                doctorRoom: formData.doctorRoom,
                experience: formData.experience,
                consultationFee: formData.consultationFee,
                schedule: formData.schedule,
              },
            }
          : { ...formData, role };

      const res = await inviteUser(payload, token);
      toast.success(res.message || `${role} invited successfully`);

      if (role === "doctor") {
        setDoctors([...doctors, res.user]);
      } else if (role === "receptionist") {
        setReceptionists([...receptionists, res.user]);
      }

      onClose();

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "",
        date_of_birth: "",
        address: "",
        profileImage: null,
        specialization: "",
        doctorRoom: "",
        experience: "",
        consultationFee: "",
        schedule: [{ day: "", startTime: "", endTime: "" }],
      });
    } catch (error) {
      toast.error(error.message || "Failed to invite user");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg relative">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {role === "doctor" ? "Add New Doctor" : "Add New Receptionist"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Common Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              required
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={handleChange}
            className="w-full text-sm text-gray-600"
          />

          {/* Doctor-specific Fields */}
          {role === "doctor" && (
            <>
              <input
                type="text"
                name="specialization"
                placeholder="Specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                name="doctorRoom"
                placeholder="Doctor Room ID"
                value={formData.doctorRoom}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="experience"
                  placeholder="Experience (years)"
                  value={formData.experience}
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  name="consultationFee"
                  placeholder="Consultation Fee"
                  value={formData.consultationFee}
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <h3 className="text-gray-700 font-medium mb-2">Schedule</h3>
                {formData.schedule.map((slot, index) => (
                  <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Day"
                      value={slot.day}
                      onChange={(e) =>
                        handleScheduleChange(index, "day", e.target.value)
                      }
                      className="border rounded-lg px-2 py-1"
                    />
                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) =>
                        handleScheduleChange(index, "startTime", e.target.value)
                      }
                      className="border rounded-lg px-2 py-1"
                    />
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) =>
                        handleScheduleChange(index, "endTime", e.target.value)
                      }
                      className="border rounded-lg px-2 py-1"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addScheduleRow}
                  className="text-sm text-blue-600 hover:underline"
                >
                  + Add another schedule
                </button>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
