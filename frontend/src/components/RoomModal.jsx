import { createRoom, updateRoom } from "@/services/roomServices"; // 👈 updateRoom bhi import kro
import { useState } from "react";
import { toast } from "react-hot-toast";

function RoomFormModal({ room, onClose, type, setRooms }) {
  const [formData, setFormData] = useState({
    roomNumber: room?.roomNumber || "",
    name: room?.name || "",
    status: room?.status || "available",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.roomNumber) newErrors.roomNumber = "Room number is required";
    if (!formData.name) newErrors.name = "Room name is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) toast.error("User not authenticated");

      let res;
      if (type === "add") {
        //  Add Room
        res = await createRoom(formData, token);

        setRooms((prev) => [...prev, res.data]);
      } else {
        
        //  Edit Room
        res = await updateRoom(room._id, formData, token);
        setRooms((prev) =>
          prev.map((r) => (r._id === room._id ? res.data : r))
        );
      }

      if (res.success) {
        toast.success(
          res.message ||
            (type === "edit"
              ? "Room updated successfully"
              : "Room created successfully")
        );
        onClose();
      } else {
        toast.error(res.message || "Operation failed");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {type === "edit" ? "Edit Room" : "Add New Room"}
          </h2>
          <p className="text-gray-600 mt-1">
            {type === "edit" ? "Update room information" : "Enter room details"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Room Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room Number *
            </label>
            <input
              type="number"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              min="1"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.roomNumber ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="e.g., 101"
              disabled={loading}
            />
            {errors.roomNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.roomNumber}</p>
            )}
          </div>

          {/* Room Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="e.g., Consultation Room 1"
              disabled={loading}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="available">Available</option>
              <option value="maintenance">Maintenance</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              {loading ? (
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 mr-2"></span>
              ) : null}
              {type === "edit" ? "Update Room" : "Add Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RoomFormModal;
