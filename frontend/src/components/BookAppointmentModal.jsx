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

// Book Appointment Modal Component
export default function BookAppointmentModal({
  isOpen,
  onClose,
  onBookAppointment,
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { doctors } = useDoctorContext();

  // Filter doctors based on search
  const filteredDoctors = useMemo(() => {
    if (!doctors) return [];

    return doctors.filter(
      (doctor) =>
        doctor.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.doctorInfo?.specialization
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [doctors, searchTerm]);

  // Generate time slots (9 AM to 5 PM, 30-minute intervals)
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        slots.push(timeString);
      }
    }
    return slots;
  }, []);

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

  // Handle doctor selection
  const handleDoctorSelect = useCallback((doctor) => {
    setSelectedDoctor(doctor);
    setCurrentStep(2);
  }, []);

  // Handle back to doctor selection
  const handleBackToDoctors = useCallback(() => {
    setCurrentStep(1);
  }, []);

  // Handle date and time selection
  const handleDateTimeSelect = useCallback(() => {
    if (!selectedDate || !selectedTimeSlot) {
      alert("Please select both date and time slot");
      return;
    }

    const appointmentData = {
      doctor: selectedDoctor._id,
      date: selectedDate,
      timeSlot: {
        startTime: selectedTimeSlot,
        endTime: getEndTime(selectedTimeSlot),
      },
      status: "Booked",
    };

    onBookAppointment(appointmentData);
    onClose();
  }, [
    selectedDoctor,
    selectedDate,
    selectedTimeSlot,
    getEndTime,
    onBookAppointment,
    onClose,
  ]);

  // Format time for display
  const formatTimeDisplay = useCallback((timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  }, []);

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
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
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
                        {doctor.city && (
                          <div className="flex items-center space-x-1 mt-1 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" />
                            <span>{doctor.city}</span>
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
                    </div>
                  </div>
                  <button
                    onClick={handleBackToDoctors}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
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
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
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
                  <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                    {timeSlots.map((timeSlot) => (
                      <button
                        key={timeSlot}
                        onClick={() => setSelectedTimeSlot(timeSlot)}
                        className={`p-3 border rounded-lg text-sm font-medium transition-all ${
                          selectedTimeSlot === timeSlot
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 hover:border-blue-300 hover:bg-blue-25"
                        }`}
                      >
                        {formatTimeDisplay(timeSlot)}
                      </button>
                    ))}
                  </div>
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
                  onClick={handleDateTimeSelect}
                  disabled={!selectedDate || !selectedTimeSlot}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Book Appointment</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
