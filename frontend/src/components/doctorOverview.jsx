'use client';

import { useAppointmentContext } from '@/context/appointmentContext';
import { useProfileContext } from '@/context/profileContext';
import {
  Calendar,
  Clock,
  Star,
  MapPin,
  Phone,
  Mail,
  Stethoscope,
  Award,
  Users,
  TrendingUp,
  FileText,
  MessageCircle,
  CheckCircle2,
  XCircle,
  Eye,
  DollarSign
} from 'lucide-react';

export default function DoctorOverview() {

    const { profile } = useProfileContext();
    const { appointments } = useAppointmentContext();
  // Mock doctor data
  const doctor = {
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    experience: "12 years",
    education: "MD, Harvard Medical School",
    rating: 4.9,
    totalPatients: 1247,
    availability: "Mon - Fri, 9:00 AM - 5:00 PM",
    contact: {
      phone: "+1 (555) 123-4567",
      email: "sarah.johnson@clinic.com"
    },
    skills: ["Cardiology", "Heart Surgery", "Echocardiography", "Cardiac Rehabilitation", "Preventive Care"],
    achievements: [
      "Board Certified Cardiologist",
      "Top Performer 2023",
      "Patient Choice Award 2022"
    ]
  };

  // Upcoming appointments
  const upcomingAppointments = [
    {
      id: 1,
      patient: "John Smith",
      time: "10:00 AM",
      duration: "30 mins",
      type: "Follow-up",
      status: "Confirmed",
      condition: "Hypertension"
    },
    {
      id: 2,
      patient: "Emma Wilson",
      time: "11:30 AM",
      duration: "45 mins",
      type: "Consultation",
      status: "Confirmed",
      condition: "Arrhythmia"
    },
    {
      id: 3,
      patient: "Robert Brown",
      time: "2:15 PM",
      duration: "60 mins",
      type: "Surgery Consultation",
      status: "Pending",
      condition: "Heart Valve Disease"
    },
    {
      id: 4,
      patient: "Sarah Davis",
      time: "3:45 PM",
      duration: "30 mins",
      type: "Check-up",
      status: "Confirmed",
      condition: "Regular Checkup"
    }
  ];

  // Today's schedule stats
  const todayStats = {
    totalAppointments: 8,
    completed: 5,
    pending: 2,
    cancelled: 1
  };

  // Patient reviews
  const patientReviews = [
    {
      id: 1,
      patient: "Michael Chen",
      rating: 5,
      date: "2 days ago",
      comment: "Dr. Johnson is absolutely amazing! She took the time to explain everything in detail and made me feel very comfortable throughout the treatment.",
      condition: "Heart Surgery"
    },
    {
      id: 2,
      patient: "Lisa Rodriguez",
      rating: 5,
      date: "1 week ago",
      comment: "Professional and caring. The best cardiologist I've ever visited. Her expertise in cardiac care is exceptional.",
      condition: "Cardiac Rehabilitation"
    },
    {
      id: 3,
      patient: "David Kim",
      rating: 4,
      date: "2 weeks ago",
      comment: "Very knowledgeable doctor. The wait time was a bit long, but the consultation was thorough and helpful.",
      condition: "Hypertension"
    }
  ];

  // Weekly performance
  const weeklyPerformance = [
    { day: 'Mon', patients: 18, revenue: 2400 },
    { day: 'Tue', patients: 22, revenue: 3200 },
    { day: 'Wed', patients: 16, revenue: 2800 },
    { day: 'Thu', patients: 25, revenue: 3600 },
    { day: 'Fri', patients: 20, revenue: 3000 },
    { day: 'Sat', patients: 12, revenue: 1800 }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Confirmed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'Pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'Cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Doctor Profile Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Stethoscope className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">{profile.firstName}</h1>
                <div className="flex items-center space-x-1 bg-blue-100 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-blue-800">4.5</span>
                </div>
              </div>
              <p className="text-lg text-gray-600 mt-1">{profile.doctorInfo.specialization}</p>
              <p className="text-gray-500 mt-2">{profile.doctorInfo.experience} experience</p>
              
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{appointments.length} Patients</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Mon, Wed, Fri</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Room 304</span>
                </div>
              </div>

              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{profile.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{profile.email}</span>
                </div>
              </div>
            </div>
          </div>
          
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Eye className="w-4 h-4" />
            <span>View Full Profile</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Appointments & Skills */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Schedule Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Today</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{todayStats.totalAppointments}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{todayStats.completed}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600 mt-1">{todayStats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cancelled</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">{todayStats.cancelled}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
              <button className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All
                <TrendingUp className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{appointment.user.firstName}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-500">{appointment.date}</span>
               
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{appointment.timeSlot.startTime}</p>
                    <p className="text-sm text-gray-500">30 mins</p>
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

          {/* Skills & Specializations */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills & Specializations</h3>
            <div className="flex flex-wrap gap-3">
              {doctor.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  <Award className="w-3 h-3 mr-1" />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Reviews & Achievements */}
        <div className="space-y-6">
          {/* Achievements */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements & Certifications</h3>
            <div className="space-y-3">
              {doctor.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm text-gray-700">{achievement}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Patient Reviews */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Patient Reviews</h3>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-900">{doctor.rating}</span>
                <span className="text-sm text-gray-500">({patientReviews.length})</span>
              </div>
            </div>
            <div className="space-y-4">
              {patientReviews.map((review) => (
                <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{review.patient}</p>
                        <p className="text-xs text-gray-500">{review.condition}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{review.comment}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{review.date}</span>
                    <button className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700">
                      <MessageCircle className="w-3 h-3" />
                      <span>Reply</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Performance */}
          {/* <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Performance</h3>
            <div className="space-y-3">
              {weeklyPerformance.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{day.day}</span>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3 text-blue-500" />
                      <span className="text-sm text-gray-600">{day.patients} pts</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-3 h-3 text-green-500" />
                      <span className="text-sm text-gray-600">${day.revenue}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}