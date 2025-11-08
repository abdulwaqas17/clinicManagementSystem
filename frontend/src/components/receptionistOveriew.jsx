'use client';

import { useAppointmentContext } from '@/context/appointmentContext';
import { useDoctorContext } from '@/context/doctorContext';
import { useProfileContext } from '@/context/profileContext';
import { useRoomContext } from '@/context/roomContext';
import { useUsersContext } from '@/context/usersContext';
import {
  Users,
  Calendar,
  Home,
  Stethoscope,
  UserCheck,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
  DollarSign,
  MessageCircle,
  Eye,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  FileText,
  BarChart3
} from 'lucide-react';

export default function ReceptionistDashboardOverview() {

   const { profile } = useProfileContext();
     const { users } = useUsersContext(); // patients
     const { rooms } = useRoomContext();
     const { appointments } = useAppointmentContext();
      const { doctors } = useDoctorContext();

  // Mock staff data
  const staff = {
    name: "Jennifer Wilson",
    role: "Senior Receptionist",
    department: "Front Desk",
    employeeId: "EMP-23456",
    joinDate: "2022-03-15",
    contact: {
      phone: "+1 (555) 234-5678",
      email: "jennifer.wilson@clinic.com",
      extension: "456"
    },
    schedule: {
      shift: "Morning (8:00 AM - 4:00 PM)",
      days: "Monday - Friday"
    }
  };

  // Today's overview stats
  const todayStats = {
    totalAppointments: 42,
    completed: 28,
    ongoing: 6,
    pending: 8,
    totalPatients: 156,
    newPatients: 12,
    availableRooms: 8,
    occupiedRooms: 7
  };

  // Today's appointments
  const todaysAppointments = [
    {
      id: 1,
      patient: "John Smith",
      doctor: "Dr. Sarah Johnson",
      time: "9:00 AM",
      room: "Room 101",
      type: "Consultation",
      status: "In Progress",
      duration: "30 mins"
    },
    {
      id: 2,
      patient: "Emma Wilson",
      doctor: "Dr. Mike Chen",
      time: "9:30 AM",
      room: "Room 102",
      type: "Follow-up",
      status: "Confirmed",
      duration: "45 mins"
    },
    {
      id: 3,
      patient: "Robert Brown",
      doctor: "Dr. Lisa Wang",
      time: "10:15 AM",
      room: "Room 103",
      type: "Therapy",
      status: "Confirmed",
      duration: "60 mins"
    },
    {
      id: 4,
      patient: "Sarah Davis",
      doctor: "Dr. James Miller",
      time: "11:00 AM",
      room: "Room 104",
      type: "Check-up",
      status: "Pending",
      duration: "30 mins"
    }
  ];

  // Room status
  const roomStatus = [
    { room: "101", status: "Occupied", doctor: "Dr. Sarah Johnson", patient: "John Smith" },
    { room: "102", status: "Occupied", doctor: "Dr. Mike Chen", patient: "Emma Wilson" },
    { room: "103", status: "Occupied", doctor: "Dr. Lisa Wang", patient: "Robert Brown" },
    { room: "104", status: "Available", doctor: "Dr. James Miller", patient: "-" },
    { room: "105", status: "Available", doctor: "-", patient: "-" },
    { room: "106", status: "Maintenance", doctor: "-", patient: "-" },
    { room: "107", status: "Available", doctor: "-", patient: "-" },
    { room: "108", status: "Occupied", doctor: "Dr. David Kim", patient: "Michael Chen" }
  ];

  // Doctor availability
  const doctorAvailability = [
    { name: "Dr. Sarah Johnson", specialty: "Cardiology", status: "Available", patients: 8 },
    { name: "Dr. Mike Chen", specialty: "Neurology", status: "In Session", patients: 6 },
    { name: "Dr. Lisa Wang", specialty: "Pediatrics", status: "Available", patients: 5 },
    { name: "Dr. James Miller", specialty: "Orthopedics", status: "Break", patients: 4 },
    { name: "Dr. David Kim", specialty: "Dermatology", status: "In Session", patients: 7 }
  ];

  // Recent activities
  const recentActivities = [
    { time: "08:30 AM", action: "Checked in John Smith", type: "Check-in" },
    { time: "08:45 AM", action: "Scheduled follow-up for Emma Wilson", type: "Scheduling" },
    { time: "09:00 AM", action: "Processed insurance for Robert Brown", type: "Billing" },
    { time: "09:15 AM", action: "Updated patient records", type: "Records" },
    { time: "09:30 AM", action: "Coordinated room assignment", type: "Coordination" }
  ];

  // Performance metrics
  const performanceMetrics = {
    appointmentsProcessed: 28,
    patientSatisfaction: 4.8,
    efficiency: 92,
    tasksCompleted: 15
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Confirmed':
      case 'Available':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'In Progress':
      case 'In Session':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'Pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'Occupied':
        return <UserCheck className="w-4 h-4 text-orange-500" />;
      case 'Maintenance':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'Break':
        return <Clock className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
      case 'In Session':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Occupied':
        return 'bg-orange-100 text-orange-800';
      case 'Maintenance':
        return 'bg-red-100 text-red-800';
      case 'Break':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Staff Profile Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <UserCheck className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">{profile.firstName} {profile.lastName}</h1>
                <div className="flex items-center space-x-1 bg-purple-100 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-purple-800">{profile.role}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{staff.department}</span>
                </div>
                {/* <div className="flex items-center space-x-2 text-gray-600">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">ID: {staff.employeeId}</span>
                </div> */}
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Since {formatDate(profile.createdAt)}</span>
                </div>
                {/* <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{staff.schedule.shift}</span>
                </div> */}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{profile.phone} </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{profile.email}</span>
                </div>
                {/* <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{staff.schedule.days}</span>
                </div> */}
              </div>
            </div>
          </div>
          
          <button className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            <BarChart3 className="w-4 h-4" />
            <span>Performance Report</span>
          </button>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Overview & Appointments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{appointments?.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Patients Today</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{users?.length}</p>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Rooms</p>
                  <p className="text-2xl font-bold text-purple-600 mt-1">{rooms?.length}</p>
                </div>
                <Home className="w-8 h-8 text-purple-600" />
              </div>
            </div>

            {/* <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New Patients</p>
                  <p className="text-2xl font-bold text-orange-600 mt-1">{todayStats.newPatients}</p>
                </div>
                <UserCheck className="w-8 h-8 text-orange-600" />
              </div>
            </div> */}
          </div>

          {/* Today's Appointments */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Today's Appointments</h3>
              <button className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                View Schedule
                <TrendingUp className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{appointment.user.firstName}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-500">{appointment.doctor.firstName}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-500">{appointment.status}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        {/* <Home className="w-3 h-3 text-gray-400" /> */}
                        {/* <span className="text-xs text-gray-500">{appointment.doctorInfo.doctorRoom.name}</span> */}
                        {/* <span className="text-gray-300">•</span> */}
                        <span className="text-xs text-gray-500">30 min</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{appointment.timeSlot.startTime}</p>
                    <div className="flex items-center space-x-1 justify-end mt-1">
                      {getStatusIcon(appointment.status)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Room Status */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Room Status</h3>
              <button className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                Manage Rooms
                <Home className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {rooms.map((room) => (
                <div key={room.name} className="border border-gray-200 rounded-lg p-4 text-center">
                  <div className="flex justify-center mb-2">
                    {getStatusIcon(room.status)}
                  </div>
                  <p className="font-medium text-gray-900">{room.name}</p>
                  <p className={`text-xs font-medium mt-1 ${getStatusColor(room.status)} px-2 py-1 rounded-full`}>
                    {room.status}
                  </p>
                  {/* {room.doctor !== '-' && (
                    <p className="text-xs text-gray-500 mt-1 truncate">{room.doctor}</p>
                  )}
                  {room.patient !== '-' && (
                    <p className="text-xs text-gray-400 mt-1 truncate">{room.patient}</p>
                  )} */}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Doctors & Activities */}
        <div className="space-y-6">
          {/* Doctor Availability */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Doctor Availability</h3>
            <div className="space-y-3">
              {doctors.map((doctor) => (
                <div key={doctor.firstName} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Stethoscope className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doctor.firstName}</p>
                      <p className="text-xs text-gray-500">{doctor.doctorInfo.specialization}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 justify-end">
                      {getStatusIcon(doctor.status)}
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doctor.status)}`}>
                        {doctor.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">290 patients</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
              <button className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All
                <FileText className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{activity.time}</span>
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                        {activity.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Performance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">Appointments Processed</span>
                </div>
                <span className="text-lg font-bold text-green-600">{performanceMetrics.appointmentsProcessed}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">Patient Satisfaction</span>
                </div>
                <span className="text-lg font-bold text-blue-600">{performanceMetrics.patientSatisfaction}/5.0</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-900">Efficiency</span>
                </div>
                <span className="text-lg font-bold text-purple-600">{performanceMetrics.efficiency}%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-gray-900">Tasks Completed</span>
                </div>
                <span className="text-lg font-bold text-orange-600">{performanceMetrics.tasksCompleted}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Users className="w-6 h-6 text-blue-600 mb-2" />
                <span className="text-xs font-medium text-gray-900 text-center">Check-in Patient</span>
              </button>
              <button className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Calendar className="w-6 h-6 text-green-600 mb-2" />
                <span className="text-xs font-medium text-gray-900 text-center">Schedule Appointment</span>
              </button>
              <button className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Home className="w-6 h-6 text-purple-600 mb-2" />
                <span className="text-xs font-medium text-gray-900 text-center">Assign Room</span>
              </button>
              <button className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <FileText className="w-6 h-6 text-orange-600 mb-2" />
                <span className="text-xs font-medium text-gray-900 text-center">Update Records</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}