"use client";

import { useState, useEffect } from "react";
import {
  X,
  Save,
  Calendar,
  Clock,
  User,
  Stethoscope,
  AlertCircle,
  Ban,
} from "lucide-react";
import { useDoctorContext } from "@/context/doctorContext";
import {
  getDoctorBookedSlots,
  updateAppointmentService,
} from "@/services/appointmentService";
import { formatTo12Hour } from "@/utils/utils";

export default function EditAppointmentModal({
  isOpen,
  onClose,
  setAppointments,
  selectedAppointment,
}) {
  const [formData, setFormData] = useState({
    doctor: "",
    date: "",
    timeSlot: {
      startTime: "",
      endTime: "",
    },
    status: "Booked",
  });

  const { doctors } = useDoctorContext();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [bookedSlots, setBookedSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [fetchingSlots, setFetchingSlots] = useState(false);

  // Load appointment data when modal opens
  useEffect(() => {
    if (isOpen && selectedAppointment) {
      const appointmentData = {
        doctor: selectedAppointment.doctor?._id || "",
        date: selectedAppointment.date
          ? new Date(selectedAppointment.date).toISOString().split("T")[0]
          : "",
        timeSlot: {
          startTime: selectedAppointment.timeSlot?.startTime || "",
          endTime: selectedAppointment.timeSlot?.endTime || "",
        },
        status: selectedAppointment.status || "Booked",
      };

      setFormData(appointmentData);
      setErrors({});

      // Fetch booked slots for the current doctor
      if (selectedAppointment.doctor?._id) {
        fetchBookedSlots(selectedAppointment.doctor._id);
      }
    }
  }, [isOpen, selectedAppointment]);

  // Fetch booked slots for a doctor
  const fetchBookedSlots = async (doctorId) => {
    try {
      setFetchingSlots(true);
      const token = localStorage.getItem("token");
      const slots = await getDoctorBookedSlots(doctorId, token);

      // Filter out the current appointment from booked slots
      const filteredSlots = slots.filter(
        (slot) => slot._id !== selectedAppointment?._id
      );

      setBookedSlots(filteredSlots);
    } catch (error) {
      console.error("Error fetching booked slots:", error);
      setBookedSlots([]);
    } finally {
      setFetchingSlots(false);
    }
  };

  // Handle doctor change
  const handleDoctorChange = async (doctorId) => {

    setFormData((prev) => ({
      ...prev,
      doctor: doctorId,
      date: "",
      timeSlot: { startTime: "", endTime: "" },
    }));

    if (doctorId) {
      await fetchBookedSlots(doctorId);
    } else {
      setBookedSlots([]);
      setAvailableSlots([]);
    }

  };

  // Handle date change
  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      date,
      timeSlot: { startTime: "", endTime: "" },
    }));

    if (date && formData.doctor) {
      generateAvailableSlots(date, formData.doctor);
    } else {
      setAvailableSlots([]);
    }
  };

  // Generate available time slots based on doctor's schedule
  const generateAvailableSlots = (selectedDate, doctorId) => {
    const selectedDoctor = doctors.find((d) => d._id === doctorId);
    if (!selectedDoctor?.doctorInfo?.schedule) {
      setAvailableSlots([]);
      return;
    }

    const selectedDay = new Date(selectedDate).toLocaleDateString("en-US", {
      weekday: "long",
    });
    const daySchedule = selectedDoctor.doctorInfo.schedule.find(
      (s) => s.day === selectedDay
    );

    if (!daySchedule) {
      setAvailableSlots([]);
      return;
    }

    // Get booked slots for this date
    const dateBookedSlots = bookedSlots.filter(
      (slot) =>
        new Date(slot.date).toDateString() ===
        new Date(selectedDate).toDateString()
    );

    // Generate 30-minute slots between start and end time
    const slots = [];
    const startTime = new Date(`${selectedDate}T${daySchedule.startTime}`);
    const endTime = new Date(`${selectedDate}T${daySchedule.endTime}`);

    let currentTime = new Date(startTime);

    while (currentTime < endTime) {
      const slotStart = currentTime.toTimeString().slice(0, 5);
      const slotEnd = new Date(currentTime.getTime() + 30 * 60000)
        .toTimeString()
        .slice(0, 5);

      // Check if slot is booked
      const isBooked = dateBookedSlots.some(
        (bookedSlot) => bookedSlot.timeSlot.startTime === slotStart
      );

      // Check if slot conflicts with current appointment (if editing)
      const isCurrentAppointment =
        selectedAppointment &&
        selectedAppointment.timeSlot.startTime === slotStart;

      slots.push({
        startTime: slotStart,
        endTime: slotEnd,
        display: `${formatTo12Hour(slotStart)} - ${formatTo12Hour(slotEnd)}`,
        isBooked: isBooked && !isCurrentAppointment,
        isAvailable: !isBooked || isCurrentAppointment,
      });

      currentTime = new Date(currentTime.getTime() + 30 * 60000);
    }

    setAvailableSlots(slots);
  };

  // Handle time slot selection
  const handleTimeSlotChange = (startTime) => {
    const selectedSlot = availableSlots.find(
      (slot) => slot.startTime === startTime
    );
    if (selectedSlot && selectedSlot.isAvailable) {
      setFormData((prev) => ({
        ...prev,
        timeSlot: {
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
        },
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.doctor) newErrors.doctor = "Doctor is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.timeSlot.startTime)
      newErrors.timeSlot = "Time slot is required";

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const token = localStorage.getItem("token");
      const result = await updateAppointmentService(
        selectedAppointment._id,
        formData,
        token
      );

      // Update appointments in context
      setAppointments((prev) =>
        prev.map((apt) =>
          apt._id === selectedAppointment._id ? result.data : apt
        )
      );

      onClose();
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const selectedDoctor = doctors.find((d) => d._id === formData.doctor);
  const selectedDay = formData.date 
    ? new Date(formData.date).toLocaleDateString("en-US", { weekday: "long" })
    : "";

  const selectedDaySchedule = selectedDoctor?.doctorInfo?.schedule?.find(
    (s) => s.day === selectedDay
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Edit Appointment
              </h2>
              <p className="text-sm text-gray-500">
                Update appointment details for{" "}
                {selectedAppointment?.user?.firstName}{" "}
                {selectedAppointment?.user?.lastName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Doctor Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
              <Stethoscope className="w-4 h-4 text-gray-400" />
              <span>Select Doctor *</span>
            </label>
            <select
              value={formData.doctor}
              onChange={(e) => handleDoctorChange(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.doctor ? "border-red-300" : "border-gray-300"
              }`}
            >
              <option value="">Select a Doctor</option>
              {doctors.map((doctor) => (
                doctor.status === "active" && (
                <option key={doctor._id} value={doctor._id}>
                  Dr. {doctor.firstName} {doctor.lastName} -{" "}
                  {doctor.doctorInfo?.specialization}
                </option>)
              ))}
            </select>
            {errors.doctor && (
              <p className="text-red-500 text-xs mt-1">{errors.doctor}</p>
            )}
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>Select Date *</span>
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleDateChange(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.date ? "border-red-300" : "border-gray-300"
              }`}
            />
            {errors.date && (
              <p className="text-red-500 text-xs mt-1">{errors.date}</p>
            )}

            {/* Doctor Availability Info */}
            {formData.doctor && formData.date && selectedDoctor && (
              <div className="mt-2 text-sm">
                {selectedDaySchedule ? (
                  <div className="flex items-center space-x-2 text-green-600">
                    <Clock className="w-4 h-4" />
                    <span>
                      Available on {selectedDay}: {formatTo12Hour(selectedDaySchedule.startTime)} - {formatTo12Hour(selectedDaySchedule.endTime)}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>Not available on {selectedDay}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Time Slot Selection */}
          {formData.doctor && formData.date && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>Select Time Slot *</span>
              </label>

              {fetchingSlots ? (
                <div className="text-center py-4">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">
                    Loading available slots...
                  </p>
                </div>
              ) : availableSlots.length > 0 ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-1">
                    {availableSlots.map((slot, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleTimeSlotChange(slot.startTime)}
                        disabled={slot.isBooked}
                        className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                          slot.isBooked
                            ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                            : formData.timeSlot.startTime === slot.startTime
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300 hover:border-blue-500 hover:text-blue-600"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{slot.display}</span>
                          {slot.isBooked && (
                            <Ban className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                        {slot.isBooked && (
                          <div className="text-xs text-red-500 mt-1">
                            Booked
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  
                  {/* Legend */}
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-blue-600 rounded"></div>
                      <span>Selected</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-white border border-gray-300 rounded"></div>
                      <span>Available</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-gray-100 rounded"></div>
                      <span>Booked</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p>No time slots available for this date</p>
                </div>
              )}

              {errors.timeSlot && (
                <p className="text-red-500 text-xs mt-1">{errors.timeSlot}</p>
              )}
            </div>
          )}

          {/* Status Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Appointment Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, status: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Booked">Booked</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Selected Appointment Summary */}
          {formData.doctor && formData.date && formData.timeSlot.startTime && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">
                Appointment Summary
              </h4>
              <div className="space-y-1 text-sm text-blue-800">
                <p>
                  <strong>Doctor:</strong> Dr. {selectedDoctor?.firstName}{" "}
                  {selectedDoctor?.lastName}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(formData.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Time:</strong> {formatTo12Hour(formData.timeSlot.startTime)} - {formatTo12Hour(formData.timeSlot.endTime)}
                </p>
                <p>
                  <strong>Duration:</strong> 30 minutes
                </p>
                <p>
                  <strong>Status:</strong> {formData.status}
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                loading ||
                !formData.doctor ||
                !formData.date ||
                !formData.timeSlot.startTime
              }
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update Appointment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}