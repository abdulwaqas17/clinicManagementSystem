'use client';

import { useAppointmentContext } from '@/context/appointmentContext';
import { useProfileContext } from '@/context/profileContext';
import {
  Calendar,
  Clock,
  FileText,
  Heart,
  Pill,
  User,
  MapPin,
  Phone,
  Mail,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock4,
  Star,
  AlertCircle,
  Stethoscope,
  CalendarClock
} from 'lucide-react';

export default function UserDashboardOverview() {

     const { profile } = useProfileContext();
      const { appointments } = useAppointmentContext();

  // Mock user data
  const user = {
    name: "John Smith",
    age: 45,
    gender: "Male",
    bloodGroup: "O+",
    contact: {
      phone: "+1 (555) 123-4567",
      email: "john.smith@email.com",
      address: "123 Main Street, New York, NY 10001"
    },
    emergencyContact: {
      name: "Sarah Smith",
      relationship: "Wife",
      phone: "+1 (555) 987-6543"
    },
    primaryPhysician: "Dr. Sarah Johnson",
    lastVisit: "2024-01-15",
    nextAppointment: "2024-02-20"
  };

  // Upcoming appointments
  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      date: "2024-02-20",
      time: "10:00 AM",
      duration: "30 mins",
      type: "Follow-up",
      status: "Confirmed",
      reason: "Hypertension Checkup"
    },
    {
      id: 2,
      doctor: "Dr. Mike Chen",
      specialty: "Dermatology",
      date: "2024-02-25",
      time: "2:15 PM",
      duration: "45 mins",
      type: "Consultation",
      status: "Pending",
      reason: "Skin Allergy"
    },
    {
      id: 3,
      doctor: "Dr. Lisa Wang",
      specialty: "Orthopedics",
      date: "2024-03-05",
      time: "11:30 AM",
      duration: "60 mins",
      type: "Therapy",
      status: "Confirmed",
      reason: "Knee Pain Treatment"
    }
  ];

  // Recent case history
  const caseHistory = [
    {
      id: 1,
      date: "2024-01-15",
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      diagnosis: "Hypertension Stage 1",
      symptoms: ["Headache", "Dizziness", "High BP"],
      treatment: "Medication + Lifestyle Changes",
      status: "Under Treatment",
      followUp: "2024-02-20"
    },
    {
      id: 2,
      date: "2023-12-10",
      doctor: "Dr. James Miller",
      specialty: "General Medicine",
      diagnosis: "Seasonal Flu",
      symptoms: ["Fever", "Cough", "Body Ache"],
      treatment: "Antiviral Medication",
      status: "Recovered",
      followUp: "None"
    },
    {
      id: 3,
      date: "2023-11-05",
      doctor: "Dr. Lisa Wang",
      specialty: "Orthopedics",
      diagnosis: "Mild Knee Sprain",
      symptoms: ["Knee Pain", "Swelling", "Difficulty Walking"],
      treatment: "Physical Therapy",
      status: "Recovered",
      followUp: "None"
    }
  ];

  // Current medications
  const currentMedications = [
    {
      id: 1,
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      purpose: "Blood Pressure",
      startDate: "2024-01-15",
      endDate: "Ongoing",
      prescribedBy: "Dr. Sarah Johnson"
    },
    {
      id: 2,
      name: "Atorvastatin",
      dosage: "20mg",
      frequency: "Once daily",
      purpose: "Cholesterol",
      startDate: "2024-01-15",
      endDate: "Ongoing",
      prescribedBy: "Dr. Sarah Johnson"
    },
    {
      id: 3,
      name: "Aspirin",
      dosage: "81mg",
      frequency: "Once daily",
      purpose: "Blood Thinner",
      startDate: "2024-01-15",
      endDate: "Ongoing",
      prescribedBy: "Dr. Sarah Johnson"
    }
  ];

  // Health stats
  const healthStats = {
    bloodPressure: "130/85 mmHg",
    heartRate: "72 bpm",
    weight: "82 kg",
    height: "178 cm",
    bmi: "25.9",
    lastCheckup: "2024-01-15"
  };

  // Appointments stats
  const appointmentStats = {
    total: 12,
    completed: 8,
    upcoming: 3,
    cancelled: 1
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Confirmed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'Pending':
        return <Clock4 className="w-4 h-4 text-yellow-500" />;
      case 'Cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'Under Treatment':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'Recovered':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default:
        return <Clock4 className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
      case 'Recovered':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'Under Treatment':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* User Profile Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">{profile.firstName}</h1>
                <div className="flex items-center space-x-1 bg-green-100 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-green-800">Patient</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  {/* <profile className="w-4 h-4" /> */}
                  <span className="text-sm">18 years, {profile.gender}</span>
                </div>
                {/* <div className="flex items-center space-x-2 text-gray-600">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">Blood Group: A</span>
                </div> */}
                {/* <div className="flex items-center space-x-2 text-gray-600">
                  <Stethoscope className="w-4 h-4" />
                  <span className="text-sm">Dr. Maaz</span>
                </div> */}
                <div className="flex items-center space-x-2 text-gray-600">
                  <CalendarClock className="w-4 h-4" />
                  <span className="text-sm">Last Visit: 8 May 2025</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{profile.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{profile.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 md:col-span-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{profile.address}</span>
                </div>
              </div>

              {/* Emergency Contact */}
              {/* <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-red-800">Emergency Contact</span>
                </div>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm text-gray-700">{user.emergencyContact.name} ({user.emergencyContact.relationship})</span>
                  <span className="text-sm text-gray-600">{user.emergencyContact.phone}</span>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Health Stats & Appointments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Health Stats */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Blood Pressure</p>
                <p className="text-lg font-semibold text-gray-900">{healthStats.bloodPressure}</p>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Heart Rate</p>
                <p className="text-lg font-semibold text-gray-900">{healthStats.heartRate}</p>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <User className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">BMI</p>
                <p className="text-lg font-semibold text-gray-900">{healthStats.bmi}</p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">Last updated: {formatDate(healthStats.lastCheckup)}</p>
            </div>
          </div>

          {/* Appointment Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{appointmentStats.total}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{appointmentStats.completed}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-yellow-600 mt-1">{appointmentStats.upcoming}</p>
                </div>
                <Clock4 className="w-8 h-8 text-yellow-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cancelled</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">{appointmentStats.cancelled}</p>
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
                <div key={appointment._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Stethoscope className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{appointment.doctor.firstName}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-500">{appointment.doctor.specialization}</span>
                      
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{formatDate(appointment.date)} at {appointment.timeSlot.startTime}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">30 mins</p>
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
        </div>

        {/* Right Column - Case History & Medications */}
        <div className="space-y-6">
          {/* Current Medications */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Medications</h3>
            <div className="space-y-3">
              {currentMedications.map((medication) => (
                <div key={medication.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Pill className="w-4 h-4 text-purple-500" />
                      <span className="font-medium text-gray-900">{medication.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{medication.dosage}</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600">Frequency: {medication.frequency}</p>
                    <p className="text-xs text-gray-600">Purpose: {medication.purpose}</p>
                    <p className="text-xs text-gray-600">Prescribed by: {medication.prescribedBy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Case History Overview */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Case History</h3>
              <button className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All
                <FileText className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="space-y-4">
              {caseHistory.slice(0, 2).map((caseItem) => (
                <div key={caseItem.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{caseItem.doctor}</p>
                      <p className="text-sm text-gray-500">{caseItem.specialty}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(caseItem.status)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(caseItem.status)}`}>
                        {caseItem.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-2">{caseItem.diagnosis}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {caseItem.symptoms.map((symptom, index) => (
                      <span key={index} className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {symptom}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 mb-2">Treatment: {caseItem.treatment}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatDate(caseItem.date)}</span>
                    {caseItem.followUp !== 'None' && (
                      <span>Follow-up: {formatDate(caseItem.followUp)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">Book New Appointment</span>
                </div>
                <TrendingUp className="w-4 h-4 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">View Medical Records</span>
                </div>
                <TrendingUp className="w-4 h-4 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-900">Contact Doctor</span>
                </div>
                <TrendingUp className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}