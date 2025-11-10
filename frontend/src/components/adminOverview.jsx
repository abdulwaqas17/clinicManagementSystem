'use client';

import React, { useMemo } from 'react';
import {
  Users,
  Stethoscope,
  Calendar,
  Home,
  DollarSign,
  CheckSquare,
  Star,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  CalendarClock
} from 'lucide-react';
import { useProfileContext } from '@/context/profileContext';
import { useUsersContext } from '@/context/usersContext';
import { useRoomContext } from '@/context/roomContext';
import { useAppointmentContext } from '@/context/appointmentContext';
import { useDoctorContext } from '@/context/doctorContext';
import { useReceptionistContext } from '@/context/receptionistContext';

export default function AdminDashboardOverview() {
  // Contexts se data lena
  const { profile } = useProfileContext();
  const { users } = useUsersContext(); // patients
  const { rooms } = useRoomContext();
  const { appointments } = useAppointmentContext();
  const { doctors } = useDoctorContext();
  const { receptionists } = useReceptionistContext();

  //  Stats calculation (dynamic)
  const stats = useMemo(() => ({
    totalPatients: users?.length || 0,
    totalDoctors: doctors?.length || 0,
    totalReceptionist: receptionists?.length || 0,
    // allAppointments: appointments?.length || 0,
    availableRooms: rooms?.length || 0,
    completeAppointments: appointments?.filter(a => a.status === 'Completed' &&
      new Date(a.date).toISOString().split('T')[0] == new Date().toISOString().split('T')[0]
    )?.length || 0,
    bookedAppointments: appointments?.filter(a => a.status === 'Booked')?.length || 0,
  }), [users, doctors, appointments, rooms]);


  //  Status helpers
  const getStatusIcon = status => {
    switch (status) {
      case 'Booked':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'Completed':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'Scheduled':
        return <CalendarClock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };


  // gtet status color
  const getStatusColor = status => {
    switch (status) {
      case 'Booked':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'Scheduled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {profile?.name || 'Admin'}! 👋
            </h1>
            <p className="text-blue-100 mt-2">
              Here's what's happening at your clinic today.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <p className="text-blue-200">Today's Date</p>
              <p className="text-xl font-semibold">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: 'Total Patients',
            value: stats.totalPatients,
            icon: <Users className="w-6 h-6 text-blue-600" />,
            bg: 'bg-blue-100',
          },
          {
            title: 'Total Doctors',
            value: stats.totalDoctors,
            icon: <Stethoscope className="w-6 h-6 text-green-600" />,
            bg: 'bg-green-100',
          },
          {
            title: 'Medical Staff',
            value: stats.totalReceptionist,
            icon: <Stethoscope className="w-6 h-6 text-green-600" />,
            bg: 'bg-green-100',
          },
            {
            title: 'Available Rooms',
            value: stats.availableRooms,
            icon: <Home className="w-6 h-6 text-purple-600" />,
            bg: 'bg-purple-100',
          },
          {
            title: "Completed Appointments",
            value: stats.completeAppointments,
            icon: <Calendar className="w-6 h-6 text-orange-600" />,
            bg: 'bg-orange-100',
          },
        
          {
            title: 'Booked Appointments',
            value: stats.bookedAppointments,
            icon: <DollarSign className="w-6 h-6 text-green-600" />,
            bg: 'bg-green-100',
          }
        ].map((card, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {card.value}
              </p>
            </div>
            <div className={`w-12 h-12 ${card.bg} rounded-lg flex items-center justify-center`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Appointments & Top Doctors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Appointments
            </h3>
          </div>
          <div className="space-y-4">
            {appointments.map(appointment => (
              <div
                key={appointment._id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {appointment.user.firstName} {appointment.user.lastName}
                    </p>
                    <p className="text-sm text-gray-500">Dr {appointment.doctor.firstName} {appointment.doctor.lastName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{appointment.timeSlot.startTime}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {getStatusIcon(appointment.status)}
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Doctors */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Top Performing Doctors
            </h3>
          </div>
          <div className="space-y-4">
            {doctors.map((doctor, index) => (
              <div
                key={doctor._id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{doctor.firstName} {doctor.lastName}</p>
                    <p className="text-sm text-gray-500">{doctor.doctorInfo.specialization}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {doctor.doctorInfo.experience} years
                  </p>
                  <div className="flex items-center space-x-1 justify-end mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">4.7</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
