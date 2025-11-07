'use client';

import { useState, useCallback } from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit,
  Save,
  X,
  Stethoscope,
  Clock,
  DollarSign,
  Briefcase,
  Shield,
  Plus,
  LogOut
} from 'lucide-react';

// Import your actual context
import { useProfileContext } from '@/context/profileContext';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const router = useRouter();
  const { profile } = useProfileContext();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

//   // Format time for display
//   const formatTime = (timeString) => {
//     if (!timeString) return 'N/A';
//     const [hours, minutes] = timeString.split(':');
//     const hour = parseInt(hours);
//     const ampm = hour >= 12 ? 'PM' : 'AM';
//     const formattedHour = hour % 12 || 12;
//     return `${formattedHour}:${minutes} ${ampm}`;
//   };

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'doctor':
        return 'bg-blue-100 text-blue-800';
      case 'receptionist':
        return 'bg-purple-100 text-purple-800';
      case 'user':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'invited':
        return 'bg-yellow-100 text-yellow-800';
      case 'disabled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleLogout = () => {
  if (window.confirm('Are you sure you want to logout?')) {
  
    router.push('/login');
    

    localStorage.removeItem('token');
  
    
    console.log('Logout successful');
  }
};

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-1">Manage your personal information</p>
          </div>
          <button
            onClick={handleEdit}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            {/* Profile Image and Basic Info */}
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                {profile?.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt={`${profile.firstName} ${profile.lastName}`}
                    className="w-32 h-32 rounded-full"
                  />
                ) : (
                  <User className="w-16 h-16 text-white" />
                )}
              </div>
              
              <h2 className="text-xl font-bold text-gray-900">
                {profile?.firstName} {profile?.lastName}
              </h2>
              
              <div className="flex justify-center space-x-2 mt-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(profile?.role)}`}>
                  {profile?.role?.charAt(0).toUpperCase() + profile?.role?.slice(1)}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(profile?.status)}`}>
                  {profile?.status?.charAt(0).toUpperCase() + profile?.status?.slice(1)}
                </span>
              </div>

              {/* Age and Gender */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{calculateAge(profile?.date_of_birth)} years old</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <User className="w-4 h-4" />
                  <span className="capitalize">{profile?.gender}</span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">{profile?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Phone</p>
                  <p className="text-sm text-gray-600">{profile?.phone}</p>
                </div>
              </div>

              {profile?.address && (
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Address</p>
                    <p className="text-sm text-gray-600">{profile?.address}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Information ke baad - ADD THIS */}
<div className="mt-6 pt-4 border-t border-gray-200">
  <button
    onClick={handleLogout}
    className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
  >
    <LogOut className="w-4 h-4" />
    <span>Logout</span>
  </button>
</div>
          </div>
        </div>

        {/* Right Column - Detailed Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <p className="text-gray-900">{profile?.firstName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <p className="text-gray-900">{profile?.lastName || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <p className="text-gray-900">{formatDate(profile?.date_of_birth)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <p className="text-gray-900 capitalize">{profile?.gender}</p>
              </div>
            </div>
          </div>

          {/* Doctor Information - Only for Doctors */}
          {profile?.role === 'doctor' && profile?.doctorInfo && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2 mb-4">
                <Stethoscope className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Specialization and Experience */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Briefcase className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Specialization</p>
                      <p className="text-lg text-blue-600 font-semibold">
                        {profile.doctorInfo.specialization || 'Not specified'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Experience</p>
                      <p className="text-lg text-gray-900">
                        {profile.doctorInfo.experience || 0} years
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Consultation Fee</p>
                      <p className="text-lg text-gray-900">
                        ${profile.doctorInfo.consultationFee || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                {profile.doctorInfo.schedule && profile.doctorInfo.schedule.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Weekly Schedule</h4>
                    <div className="space-y-2">
                      {profile.doctorInfo.schedule.map((slot, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="font-medium text-gray-700">{slot.day}</span>
                          <span className="text-sm text-gray-600">
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Account Information */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                <p className="text-gray-900">{formatDate(profile?.createdAt)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                <p className="text-gray-900">{formatDate(profile?.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <EditProfileModal
          profile={profile}
          onClose={() => setIsEditModalOpen(false)}
          onSave={(updatedProfile) => {
            console.log('Updated profile:', updatedProfile);
            setIsEditModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

// Edit Profile Modal Component
function EditProfileModal({ profile, onClose, onSave }) {
  const [formData, setFormData] = useState({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    date_of_birth: profile?.date_of_birth ? new Date(profile.date_of_birth).toISOString().split('T')[0] : '',
    gender: profile?.gender || 'male',
    address: profile?.address || '',
    profileImage: profile?.profileImage || '',
    // Doctor specific fields
    doctorInfo: profile?.doctorInfo ? {
      specialization: profile.doctorInfo.specialization || '',
      experience: profile.doctorInfo.experience || 0,
      consultationFee: profile.doctorInfo.consultationFee || 0,
      schedule: profile.doctorInfo.schedule || []
    } : null
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';

    // Doctor specific validation
    if (profile?.role === 'doctor') {
      if (!formData.doctorInfo.specialization.trim()) {
        newErrors.specialization = 'Specialization is required';
      }
      if (formData.doctorInfo.experience < 0) {
        newErrors.experience = 'Experience cannot be negative';
      }
      if (formData.doctorInfo.consultationFee < 0) {
        newErrors.consultationFee = 'Consultation fee cannot be negative';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const submissionData = {
      ...profile,
      ...formData
    };

    onSave(submissionData);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('doctorInfo.')) {
      const doctorInfoField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        doctorInfo: {
          ...prev.doctorInfo,
          [doctorInfoField]: type === 'number' ? parseFloat(value) : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const addScheduleSlot = () => {
    setFormData(prev => ({
      ...prev,
      doctorInfo: {
        ...prev.doctorInfo,
        schedule: [...(prev.doctorInfo?.schedule || []), { day: 'Monday', startTime: '09:00', endTime: '17:00' }]
      }
    }));
  };

  const updateScheduleSlot = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      doctorInfo: {
        ...prev.doctorInfo,
        schedule: prev.doctorInfo.schedule.map((slot, i) => 
          i === index ? { ...slot, [field]: value } : slot
        )
      }
    }));
  };

  const removeScheduleSlot = (index) => {
    setFormData(prev => ({
      ...prev,
      doctorInfo: {
        ...prev.doctorInfo,
        schedule: prev.doctorInfo.schedule.filter((_, i) => i !== index)
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.firstName ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.date_of_birth ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.date_of_birth && (
                  <p className="text-red-500 text-xs mt-1">{errors.date_of_birth}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.gender ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Image URL
              </label>
              <input
                type="url"
                name="profileImage"
                value={formData.profileImage}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Doctor Information - Only for Doctors */}
          {profile?.role === 'doctor' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialization *
                  </label>
                  <input
                    type="text"
                    name="doctorInfo.specialization"
                    value={formData.doctorInfo?.specialization || ''}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.specialization ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Cardiology"
                  />
                  {errors.specialization && (
                    <p className="text-red-500 text-xs mt-1">{errors.specialization}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience (Years) *
                  </label>
                  <input
                    type="number"
                    name="doctorInfo.experience"
                    value={formData.doctorInfo?.experience || 0}
                    onChange={handleChange}
                    min="0"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.experience ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.experience && (
                    <p className="text-red-500 text-xs mt-1">{errors.experience}</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Consultation Fee ($) *
                </label>
                <input
                  type="number"
                  name="doctorInfo.consultationFee"
                  value={formData.doctorInfo?.consultationFee || 0}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.consultationFee ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.consultationFee && (
                  <p className="text-red-500 text-xs mt-1">{errors.consultationFee}</p>
                )}
              </div>

              {/* Schedule Management */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Weekly Schedule</h4>
                  <button
                    type="button"
                    onClick={addScheduleSlot}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Slot</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.doctorInfo?.schedule?.map((slot, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <select
                        value={slot.day}
                        onChange={(e) => updateScheduleSlot(index, 'day', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                      </select>
                      
                      <input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => updateScheduleSlot(index, 'startTime', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      
                      <span className="text-gray-500">to</span>
                      
                      <input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => updateScheduleSlot(index, 'endTime', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      
                      <button
                        type="button"
                        onClick={() => removeScheduleSlot(index)}
                        className="p-1 text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}