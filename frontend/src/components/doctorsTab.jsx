'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Users,
  Search,
  Edit,
  Mail,
  Phone,
  Calendar,
  User,
  Eye,
  MapPin,
  Star,
  DollarSign,
  Clock,
  Briefcase,
  Filter,
  Download,
  Plus
} from 'lucide-react';

// Import your actual doctor context
import { useDoctorContext } from '@/context/doctorContext';

export default function DoctorsManagement() {
  const { doctors } = useDoctorContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Calculate age from date of birth
  const calculateAge = useCallback((dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }, []);

  // Get unique specializations for filter
  const specializations = useMemo(() => {
    if (!doctors) return [];
    const specs = doctors
      .map(doctor => doctor.doctorInfo?.specialization)
      .filter(spec => spec && spec.trim() !== '');
    return [...new Set(specs)];
  }, [doctors]);

  // Filter and search doctors
  const filteredDoctors = useMemo(() => {
    if (!doctors || !Array.isArray(doctors)) return [];

    let result = [...doctors];

    // Apply search filter
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      result = result.filter(doctor =>
        doctor.firstName?.toLowerCase().includes(lowercasedSearch) ||
        doctor.lastName?.toLowerCase().includes(lowercasedSearch) ||
        doctor.email?.toLowerCase().includes(lowercasedSearch) ||
        doctor.phone?.includes(searchTerm) ||
        doctor.doctorInfo?.specialization?.toLowerCase().includes(lowercasedSearch)
      );
    }

    // Apply specialization filter
    if (specializationFilter !== 'all') {
      result = result.filter(doctor => 
        doctor.doctorInfo?.specialization === specializationFilter
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(doctor => doctor.status === statusFilter);
    }

    return result;
  }, [doctors, searchTerm, specializationFilter, statusFilter]);

  // Handle edit doctor
  const handleEdit = useCallback((doctor) => {
    setSelectedDoctor(doctor);
    setIsEditModalOpen(true);
  }, []);

  // Handle save edited doctor
  const handleSaveEdit = useCallback((updatedDoctor) => {
    // Here you would typically update the doctor in your context/backend
    console.log('Updated doctor:', updatedDoctor);
    setIsEditModalOpen(false);
    setSelectedDoctor(null);
  }, []);

  // Format experience text
  const formatExperience = useCallback((experience) => {
    if (!experience) return 'No experience';
    return `${experience} year${experience > 1 ? 's' : ''} experience`;
  }, []);

  // Get availability status
  const getAvailability = useCallback((schedule) => {
    if (!schedule || schedule.length === 0) return 'Not Available';
    
    const today = new Date().toLocaleString('en-us', { weekday: 'long' });
    const todaySchedule = schedule.find(s => s.day === today);
    
    if (todaySchedule) {
      return `Available Today (${todaySchedule.startTime} - ${todaySchedule.endTime})`;
    }
    return 'Available This Week';
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctors Management</h1>
          <p className="text-gray-600 mt-1">
            {doctors?.length || 0} doctors in system
          </p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add New Doctor</span>
        </button>
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
                placeholder="Search doctors by name, email, phone, or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={specializationFilter}
              onChange={(e) => setSpecializationFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Specializations</option>
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="invited">Invited</option>
              <option value="disabled">Disabled</option>
            </select>

            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDoctors.map((doctor) => {
          const age = calculateAge(doctor.date_of_birth);
          const experience = formatExperience(doctor.doctorInfo?.experience);
          const availability = getAvailability(doctor.doctorInfo?.schedule);
          const consultationFee = doctor.doctorInfo?.consultationFee || 0;
          
          return (
            <div key={doctor._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Doctor Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      {doctor.profileImage ? (
                        <img
                          src={doctor.profileImage}
                          alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                          className="w-16 h-16 rounded-full"
                        />
                      ) : (
                        <User className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Dr. {doctor.firstName} {doctor.lastName}
                      </h3>
                      <p className="text-blue-600 font-medium">
                        {doctor.doctorInfo?.specialization || 'General Practitioner'}
                      </p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    doctor.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : doctor.status === 'invited'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {doctor.status?.charAt(0).toUpperCase() + doctor.status?.slice(1)}
                  </div>
                </div>

                {/* Doctor Details */}
                <div className="space-y-3">
                  {/* Experience and Age */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Briefcase className="w-4 h-4" />
                      <span>{experience}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{age} years</span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{doctor.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{doctor.phone}</span>
                    </div>
                  </div>

                  {/* Location */}
                  {doctor.city && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{doctor.city}{doctor.country && `, ${doctor.country}`}</span>
                    </div>
                  )}

                  {/* Availability */}
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-xs">{availability}</span>
                  </div>

                  {/* Consultation Fee */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <div className="flex items-center space-x-1 text-green-600">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold">{consultationFee}</span>
                      <span className="text-sm text-gray-500">consultation</span>
                    </div>
                    <div className="flex items-center space-x-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">4.8</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                  <button 
                    onClick={() => handleEdit(doctor)}
                    className="flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm font-medium">
                    <span>Disable</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredDoctors.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No doctors found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {searchTerm || specializationFilter !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your search terms or filters to find what you are looking for.'
              : 'No doctors are currently registered in the system.'
            }
          </p>
        </div>
      )}

      {/* Edit Doctor Modal */}
      {isEditModalOpen && selectedDoctor && (
        <EditDoctorModal
          doctor={selectedDoctor}
          onSave={handleSaveEdit}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedDoctor(null);
          }}
        />
      )}
    </div>
  );
}

// Edit Doctor Modal Component
function EditDoctorModal({ doctor, onSave, onClose }) {
  const [formData, setFormData] = useState({
    firstName: doctor.firstName || '',
    lastName: doctor.lastName || '',
    email: doctor.email || '',
    phone: doctor.phone || '',
    date_of_birth: doctor.date_of_birth ? new Date(doctor.date_of_birth).toISOString().split('T')[0] : '',
    gender: doctor.gender || 'male',
    address: doctor.address || '',
    city: doctor.city || '',
    country: doctor.country || '',
    status: doctor.status || 'active',
    doctorInfo: {
      specialization: doctor.doctorInfo?.specialization || '',
      experience: doctor.doctorInfo?.experience || 0,
      consultationFee: doctor.doctorInfo?.consultationFee || 0,
      schedule: doctor.doctorInfo?.schedule || []
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...doctor, ...formData });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('doctorInfo.')) {
      const doctorInfoField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        doctorInfo: {
          ...prev.doctorInfo,
          [doctorInfoField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Edit Doctor</h2>
          <p className="text-gray-600 mt-1">Update doctor information</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth *
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialization *
              </label>
              <input
                type="text"
                name="doctorInfo.specialization"
                value={formData.doctorInfo.specialization}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience (Years) *
              </label>
              <input
                type="number"
                name="doctorInfo.experience"
                value={formData.doctorInfo.experience}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Consultation Fee ($) *
              </label>
              <input
                type="number"
                name="doctorInfo.consultationFee"
                value={formData.doctorInfo.consultationFee}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="invited">Invited</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}