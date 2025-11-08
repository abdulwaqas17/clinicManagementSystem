"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";
import { createCaseHistory } from "@/services/caseHistoryService";

export default function CaseHistoryModal({ isOpen, onClose, appointment, appointments, setAppointments }) {
  const [formData, setFormData] = useState({
    diagnosis: "",
    prescription: "",
    notes: "",
    followUpDate: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if(!token){
      toast.error("User not authenticated");

      return;
    }
    try {
      const payload = {
        user: appointment.user._id,
        appointment: appointment._id,
        diagnosis: formData.diagnosis,
        prescription: formData.prescription,
        notes: formData.notes,
        followUpDate: formData.followUpDate,
      };

      const res = await createCaseHistory(payload,token);

      setAppointments(appointments.map(app => app._id === appointment._id ? {...app, status: "Completed"} : app));

       
        toast.success("Case history created successfully!");
        onClose();
    
    } catch (error) {
      toast.error("Error creating case history");
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Create Case History
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Diagnosis
            </label>
            <textarea
              name="diagnosis"
              className="w-full border rounded-md p-2"
              value={formData.diagnosis}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Prescription
            </label>
            <textarea
              name="prescription"
              className="w-full border rounded-md p-2"
              value={formData.prescription}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              name="notes"
              className="w-full border rounded-md p-2"
              value={formData.notes}
              onChange={handleChange}
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Follow-up Date
            </label>
            <input
              type="date"
              name="followUpDate"
              className="w-full border rounded-md p-2"
              value={formData.followUpDate}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
