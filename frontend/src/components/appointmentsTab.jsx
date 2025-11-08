'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Plus,
  Download,
  Eye
} from 'lucide-react';
import { useAppointmentContext } from '@/context/appointmentContext';
import { useProfileContext } from '@/context/profileContext';
import BookAppointmentModal from './BookAppointmentModal';
import CaseHistoryModal from './CaseHistoryModal';



export default function AppointmentsManagement() {
  const { appointments ,setAppointments} = useAppointmentContext();
  
  const { profile } = useProfileContext();
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
    const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handleCheckAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsCaseModalOpen(true);
  };

  // Filter and search appointments
const filteredAppointments = useMemo(() => {

    if (!appointments || !Array.isArray(appointments)) return [];

    let result = [...appointments];

    // Apply search filter
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      result = result.filter(appointment =>
        appointment.user?.firstName?.toLowerCase().includes(lowercasedSearch) ||
        appointment.user?.lastName?.toLowerCase().includes(lowercasedSearch) ||
        appointment.doctor?.firstName?.toLowerCase().includes(lowercasedSearch) ||
        appointment.doctor?.lastName?.toLowerCase().includes(lowercasedSearch)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(appointment => appointment.status === statusFilter);
    }

    // Apply date filter
    if (dateFilter !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dateFilter === 'today') {
        result = result.filter(appointment => {
          const appointmentDate = new Date(appointment.date);
          appointmentDate.setHours(0, 0, 0, 0);
          return appointmentDate.getTime() === today.getTime();
        });
      } else if (dateFilter === 'upcoming') {
        result = result.filter(appointment => {
          const appointmentDate = new Date(appointment.date);
          appointmentDate.setHours(0, 0, 0, 0);
          return appointmentDate.getTime() >= today.getTime();
        });
      } else if (dateFilter === 'past') {
        result = result.filter(appointment => {
          const appointmentDate = new Date(appointment.date);
          appointmentDate.setHours(0, 0, 0, 0);
          return appointmentDate.getTime() < today.getTime();
        });
      }
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (sortConfig.key === 'date') {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        }
        if (sortConfig.key === 'patient') {
          const nameA = `${a.user?.firstName || ''} ${a.user?.lastName || ''}`.toLowerCase();
          const nameB = `${b.user?.firstName || ''} ${b.user?.lastName || ''}`.toLowerCase();
          return sortConfig.direction === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        }
        if (sortConfig.key === 'doctor') {
          const nameA = `${a.doctor?.firstName || ''} ${a.doctor?.lastName || ''}`.toLowerCase();
          const nameB = `${b.doctor?.firstName || ''} ${b.doctor?.lastName || ''}`.toLowerCase();
          return sortConfig.direction === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        }
        if (sortConfig.key === 'status') {
          return sortConfig.direction === 'asc' 
            ? a.status.localeCompare(b.status) 
            : b.status.localeCompare(a.status);
        }
        return 0;
      });
    }

    return result;
  }, [appointments, searchTerm, statusFilter, dateFilter, sortConfig]);

  // Handle sort
  const handleSort = useCallback((key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);


   // Handle book new appointment
  const handleBookAppointment = useCallback(() => {
    setIsBookModalOpen(true);
  }, []);

  // Handle close book modal
  const handleCloseBookModal = useCallback(() => {
    setIsBookModalOpen(false);
  }, []);

  // Handle final appointment booking
  const handleFinalBookAppointment = useCallback((appointmentData) => {
    // Here you would typically save the appointment to your backend
    console.log('Booking appointment:', appointmentData);
    
    // Example of what you might do:
    // await createAppointment(appointmentData);
    // refreshAppointments(); // Refresh the appointments list
    
    alert('Appointment booked successfully!');
  }, []);

  // Get status icon and color
  const getStatusInfo = useCallback((status) => {
    switch (status) {
      case 'Booked':
        return { icon: Clock, color: 'text-blue-500', bgColor: 'bg-blue-100', text: 'Booked' };
      case 'Completed':
        return { icon: CheckCircle2, color: 'text-green-500', bgColor: 'bg-green-100', text: 'Completed' };
      case 'Cancelled':
        return { icon: XCircle, color: 'text-red-500', bgColor: 'bg-red-100', text: 'Cancelled' };
      default:
        return { icon: Clock, color: 'text-gray-500', bgColor: 'bg-gray-100', text: 'Unknown' };
    }
  }, []);

  // Format date for display
  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  // Format time for display
//   const formatTime = useCallback((timeString) => {
//     if (!timeString) return 'N/A';
//     const [hours, minutes] = timeString.split(':');
//     const hour = parseInt(hours);
//     const ampm = hour >= 12 ? 'PM' : 'AM';
//     const formattedHour = hour % 12 || 12;
//     return `${formattedHour}:${minutes} ${ampm}`;
//   }, []);

  return (
    <div className="space-y-6">
   {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments Management</h1>
          <p className="text-gray-600 mt-1">
            {filteredAppointments.length} appointments found
          </p>
        </div>
      { profile?.role !== "doctor" && (
         <button 
          onClick={handleBookAppointment}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Book New Appointment</span>
        </button>
      )} 
      </div>

      {/* Filters and Search Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search appointments by patient or doctor name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Booked">Booked</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>

            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('patient')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Patient</span>
                    {sortConfig.key === 'patient' && (
                      <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('doctor')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Doctor</span>
                    {sortConfig.key === 'doctor' && (
                      <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Date & Time</span>
                    {sortConfig.key === 'date' && (
                      <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    {sortConfig.key === 'status' && (
                      <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => {
                const StatusIcon = getStatusInfo(appointment.status).icon;
                
                return (
                  <tr key={appointment._id} className="hover:bg-gray-50 transition-colors">
                    {/* Patient Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.user?.firstName} {appointment.user?.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            Patient
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Doctor Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <Stethoscope className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.doctor?.doctorInfo?.specialization || 'Doctor'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm text-gray-900">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{formatDate(appointment.date)}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>
                            {appointment.timeSlot?.startTime} - {appointment.timeSlot?.endTime}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusInfo(appointment.status).bgColor} ${getStatusInfo(appointment.status).color}`}>
                        <StatusIcon className="w-3 h-3" />
                        <span>{getStatusInfo(appointment.status).text}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                         {profile?.role === "doctor" && (
        <button
          onClick={() => handleCheckAppointment(appointment)}
          className="flex items-center space-x-1 text-green-600 hover:text-green-700 px-2 py-1 rounded hover:bg-green-50"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Check</span>
        </button>
      )}
                        <button
                          onClick={() => handleEdit(appointment)}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(appointment._id)}
                          className="flex items-center space-x-1 text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-lg">No appointments found</p>
            <p className="text-gray-400 text-sm mt-1">
              {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                ? 'Try adjusting your filters or search terms'
                : 'No appointments scheduled yet'
              }
            </p>
          </div>
        )}
      </div>

    <BookAppointmentModal
        isOpen={isBookModalOpen}
        onClose={handleCloseBookModal}
        onBookAppointment={handleFinalBookAppointment}
        setAppointments={setAppointments}
        appointments={appointments}
      />

        <CaseHistoryModal
        isOpen={isCaseModalOpen}
        onClose={() => setIsCaseModalOpen(false)}
        appointment={selectedAppointment}
        appointments={appointments}
        setAppointments={setAppointments}
      
      />
    </div>
  );
}

