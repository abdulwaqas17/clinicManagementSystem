"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  Star,
  DollarSign,
  CheckCircle2,
  Briefcase,
} from "lucide-react";
import { useDoctorContext } from "@/context/doctorContext";
import {
  bookAppointment,
  getDoctorBookedSlots,
} from "@/services/appointmentService";
import toast from "react-hot-toast";

// Book Appointment Modal Component
export default function BookAppointmentModal({
  isOpen,
  onClose,
  setAppointments,
  appointments,
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const { doctors } = useDoctorContext();

  // Filter doctors based on search
  const filteredDoctors = useMemo(() => {
    if (!doctors) return [];

    return doctors.filter(
      (doctor) =>
        doctor.status == "active" && (
        doctor.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.doctorInfo?.specialization
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()))
    );
  }, [doctors, searchTerm]);

  // Get available time slots based on doctor's schedule for selected day
  const availableTimeSlots = useMemo(() => {
    if (!selectedDoctor || !selectedDate) return [];

    const dayOfWeek = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' });
    
    // Find doctor's schedule for the selected day
    const doctorSchedule = selectedDoctor.doctorInfo?.schedule?.find(
      schedule => schedule.day === dayOfWeek
    );

    if (!doctorSchedule) {
      // toast.error(`Doctor is not available on ${dayOfWeek}`);
      return [];
    }

    const { startTime, endTime } = doctorSchedule;
    
    // Convert time strings to minutes for easier calculation
    const startMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
    const endMinutes = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);
    
    const slots = [];
    const slotDuration = 30; // 30 minutes per slot
    
    for (let time = startMinutes; time < endMinutes; time += slotDuration) {
      const hours = Math.floor(time / 60);
      const minutes = time % 60;
      const timeString = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
      
      slots.push(timeString);
    }

    // console.log("===================availableTimeSlots=================");
    // console.log("Day:", dayOfWeek);
    // console.log("Schedule:", doctorSchedule);
    // console.log("Generated Slots:", slots);
    // console.log("===================availableTimeSlots=================");
    
    return slots;
  }, [selectedDoctor, selectedDate]);

  // Calculate end time based on start time (30 minutes duration)
  const getEndTime = useCallback((startTime) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    let endHours = hours;
    let endMinutes = minutes + 30;

    if (endMinutes >= 60) {
      endHours += 1;
      endMinutes -= 60;
    }

    return `${endHours.toString().padStart(2, "0")}:${endMinutes
      .toString()
      .padStart(2, "0")}`;
  }, []);

  // jab doctor select ho to uske booked slots laen
  const handleDoctorSelect = async (doctor) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("User not authenticated");
      return;
    }
    setSelectedDoctor(doctor);
    setCurrentStep(2);
    setSelectedDate("");
    setSelectedTimeSlot("");

    try {
      const slots = await getDoctorBookedSlots(doctor._id, token);
      setBookedSlots(slots);
    } catch (error) {
      console.error("Failed to fetch doctor slots:", error.message);
      setBookedSlots([]);
    }
  };

  // Format time for display
  const formatTimeDisplay = useCallback((timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  }, []);

  // check if slot is booked
  const isSlotBooked = (timeSlot, date) => {
    if (!date || !bookedSlots.length) return false;

    // normalize date comparison (UTC vs local fix)
    const selectedDateStr = new Date(date).toISOString().split("T")[0];

    return bookedSlots.some((appt) => {
      const apptDateStr = new Date(appt.date).toISOString().split("T")[0];
      
      return (
        apptDateStr === selectedDateStr &&
        appt.timeSlot?.startTime?.trim() === timeSlot
      );
    });
  };

  // Check if doctor is available on selected date
  const isDoctorAvailableOnDate = useCallback((date) => {
    if (!selectedDoctor || !date) return false;
    
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    return selectedDoctor.doctorInfo?.schedule?.some(
      schedule => schedule.day === dayOfWeek
    );
  }, [selectedDoctor]);

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(""); // Reset time slot when date changes
    
    if (!isDoctorAvailableOnDate(date)) {
      const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
      toast.error(`Doctor is not available on ${dayOfWeek}`);
    }
  };

  // Handle back to doctor selection
  const handleBackToDoctors = useCallback(() => {
    setCurrentStep(1);
    setSelectedDate("");
    setSelectedTimeSlot("");
  }, []);

  // Book Appointment
  const handleBookAppointment = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("User not authenticated");
      return;
    }

    if (!selectedDoctor || !selectedDate || !selectedTimeSlot) {
      toast.error("Please select doctor, date, and time slot");
      return;
    }

    // Double check doctor availability
    if (!isDoctorAvailableOnDate(selectedDate)) {
      const dayOfWeek = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' });
      toast.error(`Doctor is not available on ${dayOfWeek}`);
      return;
    }

    try {
      setLoading(true);
      const timeSlot = {
        startTime: selectedTimeSlot,
        endTime: getEndTime(selectedTimeSlot),
      };

      const res = await bookAppointment(
        selectedDoctor._id,
        selectedDate,
        timeSlot,
        token
      );

      setAppointments([...appointments, res.data]);

      setSelectedDate("");
      setSelectedTimeSlot("");
      setSelectedDoctor(null);
      setCurrentStep(1);

      toast.success("Appointment booked successfully!");
      onClose(); // modal band karo
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Book New Appointment
            </h2>
            <div className="flex items-center space-x-4 mt-2">
              <div
                className={`flex items-center space-x-2 ${
                  currentStep >= 1 ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    currentStep >= 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  1
                </div>
                <span className="text-sm">Select Doctor</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <div
                className={`flex items-center space-x-2 ${
                  currentStep >= 2 ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    currentStep >= 2
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  2
                </div>
                <span className="text-sm">Select Date & Time</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Step 1: Select Doctor */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Select a Doctor
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Choose from available medical specialists
                  </p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search doctors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Doctors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDoctors.map((doctor) => (
                  <div
                    key={doctor._id}
                    onClick={() => handleDoctorSelect(doctor)}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        {doctor.profileImage ? (
                          <img
                            src={doctor.profileImage}
                            alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                            className="w-12 h-12 rounded-full"
                          />
                        ) : (
                          <User className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          Dr. {doctor.firstName} {doctor.lastName}
                        </h4>
                        <p className="text-blue-600 text-sm font-medium">
                          {doctor.doctorInfo?.specialization ||
                            "General Practitioner"}
                        </p>
                        <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Briefcase className="w-3 h-3" />
                            <span>
                              {doctor.doctorInfo?.experience || 0} years
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-3 h-3" />
                            <span>
                              ${doctor.doctorInfo?.consultationFee || 0}
                            </span>
                          </div>
                        </div>
                        {/* Doctor Schedule Summary */}
                        {doctor.doctorInfo?.schedule && (
                          <div className="mt-2 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>
                                Available: {doctor.doctorInfo.schedule.map(s => s.day.substring(0, 3)).join(", ")}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 text-yellow-500">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-xs font-medium">4.8</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredDoctors.length === 0 && (
                <div className="text-center py-8">
                  <Stethoscope className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No doctors found</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {searchTerm
                      ? "Try adjusting your search terms"
                      : "No doctors available"}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Select Date & Time */}
          {currentStep === 2 && selectedDoctor && (
            <div className="space-y-6">
              {/* Doctor Summary */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      {selectedDoctor.profileImage ? (
                        <img
                          src={selectedDoctor.profileImage}
                          alt={`Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName}`}
                          className="w-12 h-12 rounded-full"
                        />
                      ) : (
                        <User className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
                      </h4>
                      <p className="text-blue-600 text-sm">
                        {selectedDoctor.doctorInfo?.specialization}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {selectedDoctor.doctorInfo?.experience} years experience
                        • ${selectedDoctor.doctorInfo?.consultationFee}{" "}
                        consultation
                      </p>
                      {/* Doctor Schedule */}
                      {selectedDoctor.doctorInfo?.schedule && (
                        <div className="mt-1 text-xs text-gray-600">
                          <strong>Available Days:</strong> {selectedDoctor.doctorInfo.schedule.map(s => 
                            `${s.day} (${formatTimeDisplay(s.startTime)}-${formatTimeDisplay(s.endTime)})`
                          ).join(", ")}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleBackToDoctors}
                    className="flex items-center cursor-pointer space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Change Doctor</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Date Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Select Date
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => handleDateSelect(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        selectedDate && !isDoctorAvailableOnDate(selectedDate) 
                          ? "border-red-300 bg-red-50" 
                          : "border-gray-300"
                      }`}
                    />
                    {selectedDate && (
                      <div className={`text-sm ${
                        isDoctorAvailableOnDate(selectedDate) 
                          ? "text-green-600" 
                          : "text-red-600"
                      }`}>
                        {isDoctorAvailableOnDate(selectedDate) 
                          ? `✓ Available on ${new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' })}`
                          : `✗ Not available on ${new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' })}`
                        }
                      </div>
                    )}
                    <div className="text-sm text-gray-500">
                      Select your preferred appointment date
                    </div>
                  </div>
                </div>

                {/* Time Slot Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Select Time Slot
                  </h3>
                  {selectedDate && isDoctorAvailableOnDate(selectedDate) ? (
                    <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                      {availableTimeSlots.map((timeSlot) => {
                        const booked = isSlotBooked(timeSlot, selectedDate);
                        return (
                          <button
                            key={timeSlot}
                            disabled={booked}
                            onClick={() => setSelectedTimeSlot(timeSlot)}
                            className={`p-3 border rounded-lg text-sm font-medium transition-all ${
                              booked
                                ? "bg-red-100 text-red-400 cursor-not-allowed opacity-60"
                                : selectedTimeSlot === timeSlot
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-gray-200 hover:border-blue-300 hover:bg-blue-25"
                            }`}
                          >
                            {formatTimeDisplay(timeSlot)}
                            {booked && (
                              <span className="block text-xs text-red-500">
                                (Booked)
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                      <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">
                        {selectedDate 
                          ? "Doctor is not available on selected date" 
                          : "Please select a date first"
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Appointment Summary */}
              {(selectedDate || selectedTimeSlot) && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Appointment Summary
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    {selectedDate && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>
                          {new Date(selectedDate).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                        {!isDoctorAvailableOnDate(selectedDate) && (
                          <span className="text-red-500 text-xs">(Not Available)</span>
                        )}
                      </div>
                    )}
                    {selectedTimeSlot && (
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>
                          {formatTimeDisplay(selectedTimeSlot)} -{" "}
                          {formatTimeDisplay(getEndTime(selectedTimeSlot))}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between pt-4 border-t border-gray-200">
                <button
                  onClick={handleBackToDoctors}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleBookAppointment}
                  disabled={!selectedDate || !selectedTimeSlot || !isDoctorAvailableOnDate(selectedDate)}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{loading ? "Booking Appointment..." : "Book Appointment"} </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}