'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Home,
  Search,
  Edit,
  Plus,
  Download,
  CheckCircle2,
  XCircle,
  Wrench,
  MoreVertical,
  Trash2,
  Eye
} from 'lucide-react';

// Import your actual contexts
import { useRoomContext } from '@/context/roomContext';
import { useProfileContext } from '@/context/profileContext';
import RoomFormModal from './RoomModal';

export default function RoomsManagement() {
  const { rooms ,setRooms} = useRoomContext();
  const { profile } = useProfileContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'roomNumber', direction: 'asc' });

  // Filter and search rooms
  const filteredRooms = useMemo(() => {
    if (!rooms || !Array.isArray(rooms)) return [];

    let result = [...rooms];

    // Apply search filter
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      result = result.filter(room =>
        room.roomNumber?.toString().includes(searchTerm) ||
        room.name?.toLowerCase().includes(lowercasedSearch)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(room => room.status === statusFilter);
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (sortConfig.key === 'roomNumber') {
          return sortConfig.direction === 'asc' ? a.roomNumber - b.roomNumber : b.roomNumber - a.roomNumber;
        }
        if (sortConfig.key === 'name') {
          const nameA = (a.name || '').toLowerCase();
          const nameB = (b.name || '').toLowerCase();
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
  }, [rooms, searchTerm, statusFilter, sortConfig]);

  // Handle sort
  const handleSort = useCallback((key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  // Handle add new room (admin only)
  const handleAddRoom = useCallback(() => {
    setSelectedRoom(null);
    setIsAddModalOpen(true);
  }, []);

  // Handle edit room (admin only)
  const handleEdit = useCallback((room) => {
    setSelectedRoom(room);
    setIsAddModalOpen(true);
  }, []);

  // Handle save room (both add and edit)
  const handleSaveRoom = useCallback((roomData) => {
    // Here you would typically save the room to your context/backend
    console.log('Save room:', roomData);
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedRoom(null);
  }, []);

  // Handle delete room (admin only)
  const handleDelete = useCallback((roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      // Here you would typically delete the room
      console.log('Delete room:', roomId);
    }
  }, []);

  // Get status icon and color
  const getStatusInfo = useCallback((status) => {
    switch (status) {
      case 'available':
        return { 
          icon: CheckCircle2, 
          color: 'text-green-500', 
          bgColor: 'bg-green-100', 
          text: 'Available',
          description: 'Ready for use'
        };
      case 'maintenance':
        return { 
          icon: Wrench, 
          color: 'text-yellow-500', 
          bgColor: 'bg-yellow-100', 
          text: 'Maintenance',
          description: 'Under maintenance'
        };
      case 'disabled':
        return { 
          icon: XCircle, 
          color: 'text-red-500', 
          bgColor: 'bg-red-100', 
          text: 'Disabled',
          description: 'Not available'
        };
      default:
        return { 
          icon: XCircle, 
          color: 'text-gray-500', 
          bgColor: 'bg-gray-100', 
          text: 'Unknown',
          description: 'Status unknown'
        };
    }
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

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rooms Management</h1>
          <p className="text-gray-600 mt-1">
            {rooms?.length || 0} rooms in system
          </p>
        </div>
        
        {/* Add Room Button - Only for Admin */}
        {profile?.role === 'admin' && (
          <button 
            onClick={handleAddRoom}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Room</span>
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
                placeholder="Search rooms by number or name..."
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
              <option value="available">Available</option>
              <option value="maintenance">Maintenance</option>
              <option value="disabled">Disabled</option>
            </select>

            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map((room) => {
          const StatusIcon = getStatusInfo(room.status).icon;
          
          return (
            <div key={room._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Room Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <Home className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Room {room.roomNumber}
                      </h3>
                      <p className="text-gray-600">
                        {room.name || `Room ${room.roomNumber}`}
                      </p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(room.status).bgColor} ${getStatusInfo(room.status).color}`}>
                    {getStatusInfo(room.status).text}
                  </div>
                </div>

                {/* Room Details */}
                <div className="space-y-3">
                  {/* Status Description */}
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <StatusIcon className="w-4 h-4" />
                    <span>{getStatusInfo(room.status).description}</span>
                  </div>

                  {/* Created Date */}
                  <div className="text-xs text-gray-500">
                    Added on {formatDate(room.createdAt)}
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
                  
                  {/* Edit Button - Only for Admin */}
                  {profile?.role === 'admin' && (
                    <button 
                      onClick={() => handleEdit(room)}
                      className="flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  )}
                  
                  {/* Delete Button - Only for Admin */}
                  {profile?.role === 'admin' && (
                    <button 
                      onClick={() => handleDelete(room._id)}
                      className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredRooms.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No rooms found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search terms or filters to find what you are looking for.'
              : 'No rooms are currently available in the system.'
            }
          </p>
          {profile?.role === 'admin' && (
            <button 
              onClick={handleAddRoom}
              className="mt-4 flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Room</span>
            </button>
          )}
        </div>
      )}

      {/* Add/Edit Room Modal */}
      {isAddModalOpen  && (
        <RoomFormModal
          room={selectedRoom}
          setRooms={setRooms}
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
          }}
          type="add"
        />
      )}
    </div>
  );
}
