'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  FileText,
  Search,
  Filter,
  Calendar,
  User,
  Stethoscope,
  Eye,
  Download,
  Plus,
  Clock,
  MapPin,
  Pill,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useCaseHistoryContext } from '@/context/caseHistoryContext';


export default function CaseHistoryManagement() {
  const { caseHistory } = useCaseHistoryContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedCase, setExpandedCase] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  // Filter and search case history
  const filteredCaseHistory = useMemo(() => {
    if (!caseHistory || !Array.isArray(caseHistory)) return [];

    let result = [...caseHistory];

    // Apply search filter
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      result = result.filter(caseItem =>
        caseItem.user?.firstName?.toLowerCase().includes(lowercasedSearch) ||
        caseItem.user?.lastName?.toLowerCase().includes(lowercasedSearch) ||
        caseItem.doctor?.firstName?.toLowerCase().includes(lowercasedSearch) ||
        caseItem.doctor?.lastName?.toLowerCase().includes(lowercasedSearch) ||
        caseItem.diagnosis?.toLowerCase().includes(lowercasedSearch) ||
        caseItem.prescription?.toLowerCase().includes(lowercasedSearch)
      );
    }

    // Apply status filter (based on follow-up date)
    if (statusFilter !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (statusFilter === 'follow-up') {
        result = result.filter(caseItem => 
          caseItem.followUpDate && new Date(caseItem.followUpDate) >= today
        );
      } else if (statusFilter === 'completed') {
        result = result.filter(caseItem => 
          !caseItem.followUpDate || new Date(caseItem.followUpDate) < today
        );
      }
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (sortConfig.key === 'date') {
          const dateA = new Date(a.appointment?.date || a.createdAt);
          const dateB = new Date(b.appointment?.date || b.createdAt);
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
        if (sortConfig.key === 'diagnosis') {
          return sortConfig.direction === 'asc' 
            ? a.diagnosis.localeCompare(b.diagnosis) 
            : b.diagnosis.localeCompare(a.diagnosis);
        }
        return 0;
      });
    }

    return result;
  }, [caseHistory, searchTerm, statusFilter, sortConfig]);

  // Handle sort
  const handleSort = useCallback((key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  // Toggle case expansion
  const toggleExpand = useCallback((caseId) => {
    setExpandedCase(prev => prev === caseId ? null : caseId);
  }, []);

  // Handle view details
  const handleViewDetails = useCallback((caseItem) => {
    setSelectedCase(caseItem);
    setIsDetailModalOpen(true);
  }, []);

  // Format date for display
  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  // Check if follow-up is upcoming
  const isUpcomingFollowUp = useCallback((followUpDate) => {
    if (!followUpDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const followUp = new Date(followUpDate);
    followUp.setHours(0, 0, 0, 0);
    return followUp >= today;
  }, []);

  // Get follow-up status
  const getFollowUpStatus = useCallback((caseItem) => {
    if (!caseItem.followUpDate) {
      return { text: 'No Follow-up', color: 'text-gray-500', bgColor: 'bg-gray-100' };
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const followUp = new Date(caseItem.followUpDate);
    followUp.setHours(0, 0, 0, 0);
    
    if (followUp < today) {
      return { text: 'Follow-up Overdue', color: 'text-red-500', bgColor: 'bg-red-100' };
    }
    
    const diffTime = followUp - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return { text: 'Follow-up Today', color: 'text-orange-500', bgColor: 'bg-orange-100' };
    } else if (diffDays <= 7) {
      return { text: `Follow-up in ${diffDays} days`, color: 'text-yellow-500', bgColor: 'bg-yellow-100' };
    } else {
      return { text: 'Follow-up Scheduled', color: 'text-green-500', bgColor: 'bg-green-100' };
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Case History</h1>
          <p className="text-gray-600 mt-1">
            {caseHistory?.length || 0} medical cases recorded
          </p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add New Case</span>
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
                placeholder="Search cases by patient, doctor, diagnosis, or prescription..."
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
              <option value="all">All Cases</option>
              <option value="follow-up">Follow-up Required</option>
              <option value="completed">Completed</option>
            </select>

            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Case History List */}
      <div className="space-y-4">
        {filteredCaseHistory.map((caseItem) => {
          const followUpStatus = getFollowUpStatus(caseItem);
          const isExpanded = expandedCase === caseItem._id;
          
          return (
            <div key={caseItem._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Case Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {caseItem.diagnosis}
                      </h3>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${followUpStatus.bgColor} ${followUpStatus.color}`}>
                        {followUpStatus.text}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      {/* Patient Info */}
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {caseItem.user?.firstName} {caseItem.user?.lastName}
                          </p>
                          <p className="text-gray-500">Patient</p>
                        </div>
                      </div>

                      {/* Doctor Info */}
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <Stethoscope className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Dr. {caseItem.doctor?.firstName} {caseItem.doctor?.lastName}
                          </p>
                          <p className="text-gray-500">
                            {caseItem.doctor?.doctorInfo?.specialization || 'Doctor'}
                          </p>
                        </div>
                      </div>

                      {/* Appointment Date */}
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {formatDate(caseItem.appointment?.date)}
                          </p>
                          <p className="text-gray-500">Visit Date</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Preview */}
                <div className="space-y-2">
                  {caseItem.prescription && (
                    <div className="flex items-start space-x-2 text-sm text-gray-600">
                      <Pill className="w-4 h-4 text-purple-500 mt-0.5" />
                      <span className="flex-1">
                        <strong>Prescription:</strong> {caseItem.prescription.length > 100 
                          ? `${caseItem.prescription.substring(0, 100)}...` 
                          : caseItem.prescription}
                      </span>
                    </div>
                  )}
                  
                  {caseItem.notes && (
                    <div className="flex items-start space-x-2 text-sm text-gray-600">
                      <FileText className="w-4 h-4 text-blue-500 mt-0.5" />
                      <span className="flex-1">
                        <strong>Notes:</strong> {caseItem.notes.length > 100 
                          ? `${caseItem.notes.substring(0, 100)}...` 
                          : caseItem.notes}
                      </span>
                    </div>
                  )}

                  {caseItem.followUpDate && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span>
                        <strong>Follow-up:</strong> {formatDate(caseItem.followUpDate)}
                        {isUpcomingFollowUp(caseItem.followUpDate) && (
                          <span className="ml-2 text-orange-600 font-medium">(Upcoming)</span>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions & Expandable Section */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleExpand(caseItem._id)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        <span>Show Less</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        <span>Show More</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleViewDetails(caseItem)}
                      className="flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>

                {/* Expandable Content */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                    {caseItem.prescription && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Full Prescription</h4>
                        <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                          {caseItem.prescription}
                        </p>
                      </div>
                    )}
                    
                    {caseItem.notes && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Clinical Notes</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                          {caseItem.notes}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCaseHistory.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No case history found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search terms or filters to find what you are looking for.'
              : 'No medical cases have been recorded yet.'
            }
          </p>
        </div>
      )}

      {/* Case Details Modal */}
      {isDetailModalOpen && selectedCase && (
        <CaseDetailsModal
          caseItem={selectedCase}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedCase(null);
          }}
        />
      )}
    </div>
  );
}

// Case Details Modal Component
function CaseDetailsModal({ caseItem, onClose }) {
  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Case Details</h2>
          <p className="text-gray-600 mt-1">Complete medical case information</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Diagnosis Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Diagnosis</h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="font-medium text-red-800">Primary Diagnosis</span>
              </div>
              <p className="text-gray-700">{caseItem.diagnosis}</p>
            </div>
          </div>

          {/* Patient and Doctor Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Patient Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Patient Information</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {caseItem.user?.firstName} {caseItem.user?.lastName}
                    </p>
                    <p className="text-sm text-gray-500">Patient</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Doctor Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Treating Doctor</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Dr. {caseItem.doctor?.firstName} {caseItem.doctor?.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {caseItem.doctor?.doctorInfo?.specialization || 'General Practitioner'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {caseItem.doctor?.doctorInfo?.experience || '0'} years experience
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Appointment Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900">Visit Date</p>
                  <p className="text-sm text-gray-600">{formatDate(caseItem.appointment?.date)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900">Recorded On</p>
                  <p className="text-sm text-gray-600">{formatDate(caseItem.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Prescription */}
          {caseItem.prescription && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Prescription</h4>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Pill className="w-5 h-5 text-purple-500" />
                  <span className="font-medium text-purple-800">Medication & Treatment</span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{caseItem.prescription}</p>
              </div>
            </div>
          )}

          {/* Clinical Notes */}
          {caseItem.notes && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Clinical Notes</h4>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <span className="font-medium text-gray-800">Doctor's Notes</span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{caseItem.notes}</p>
              </div>
            </div>
          )}

          {/* Follow-up Information */}
          {caseItem.followUpDate && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Follow-up Schedule</h4>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <span className="font-medium text-orange-800">Next Follow-up</span>
                </div>
                <p className="text-gray-700">{formatDate(caseItem.followUpDate)}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}