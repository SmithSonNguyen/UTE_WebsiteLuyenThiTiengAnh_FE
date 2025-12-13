import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Users,
  Plus,
  Trash2,
  BookOpen,
  Mail,
  Phone,
  Award,
  Briefcase,
  GraduationCap,
  Calendar,
  X,
  Search,
} from "lucide-react";
import { toast } from "react-toastify";

const InstructorManagement = () => {
  const accessToken = useSelector((state) => state.auth.login.accessToken);

  const [instructors, setInstructors] = useState([]);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);

  // Form states
  const [createForm, setCreateForm] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    phone: "",
    bio: "",
    position: "Giảng viên",
    specialization: "",
    experience: "",
    education: "",
  });

  const [assignForm, setAssignForm] = useState({
    instructorId: "",
    classId: "",
  });

  useEffect(() => {
    fetchInstructors();
  }, [accessToken]);

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/instructors`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch instructors");

      const result = await response.json();
      setInstructors(result.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableClasses = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/available-classes`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch classes");

      const result = await response.json();
      setAvailableClasses(result.data);
    } catch (err) {
      console.error("Error fetching classes:", err);
    }
  };

  const handleCreateInstructor = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/instructors`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(createForm),
        }
      );

      if (!response.ok) throw new Error("Failed to create instructor");

      toast.success("Tạo instructor thành công!");
      setShowCreateModal(false);
      setCreateForm({
        email: "",
        password: "",
        firstname: "",
        lastname: "",
        phone: "",
        bio: "",
        position: "Giảng viên",
        specialization: "",
        experience: "",
        education: "",
      });
      fetchInstructors();
    } catch (err) {
      toast.error("Lỗi: " + err.message);
    }
  };

  const handleDeleteInstructor = async () => {
    if (!selectedInstructor) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/instructors/${
          selectedInstructor._id
        }`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete instructor");
      }

      toast.success("Xóa instructor thành công!");
      setShowDeleteModal(false);
      setSelectedInstructor(null);
      fetchInstructors();
    } catch (err) {
      toast.error("Lỗi: " + err.message);
    }
  };

  const handleAssignClass = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/assign-class`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(assignForm),
        }
      );

      if (!response.ok) throw new Error("Failed to assign class");

      toast.success("Gán lớp thành công!");
      setShowAssignModal(false);
      setAssignForm({ instructorId: "", classId: "" });
      fetchInstructors();
    } catch (err) {
      toast.error("Lỗi: " + err.message);
    }
  };

  const openAssignModal = (instructor) => {
    setSelectedInstructor(instructor);
    setAssignForm({ ...assignForm, instructorId: instructor._id });
    fetchAvailableClasses();
    setShowAssignModal(true);
  };

  const openDeleteModal = (instructor) => {
    setSelectedInstructor(instructor);
    setShowDeleteModal(true);
  };

  const filteredInstructors = instructors.filter((instructor) => {
    const fullName =
      `${instructor.profile.lastname} ${instructor.profile.firstname}`.toLowerCase();
    const email = instructor.profile.email.toLowerCase();
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || email.includes(search);
  });

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-gray-500">Loading instructors...</div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Teacher Management
          </h1>
          <p className="text-gray-500">Manage teachers and assign classes</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Instructor
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Instructors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInstructors.map((instructor) => (
          <div
            key={instructor._id}
            className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
          >
            {/* Avatar and Basic Info */}
            <div className="flex items-start gap-4 mb-4">
              <img
                src={
                  instructor.profile.avatar || "https://via.placeholder.com/80"
                }
                alt={`${instructor.profile.firstname} ${instructor.profile.lastname}`}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800">
                  {instructor.profile.lastname} {instructor.profile.firstname}
                </h3>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {instructor.profile.email}
                </p>
                {instructor.profile.phone && (
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {instructor.profile.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Bio */}
            {instructor.profile.bio && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {instructor.profile.bio}
              </p>
            )}

            {/* Instructor Info */}
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Briefcase className="w-4 h-4" />
                <span>{instructor.instructorInfo?.position}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Award className="w-4 h-4" />
                <span>{instructor.instructorInfo?.specialization}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{instructor.instructorInfo?.experience}</span>
              </div>
              {instructor.instructorInfo?.education && (
                <div className="flex items-center gap-2 text-gray-600">
                  <GraduationCap className="w-4 h-4" />
                  <span>{instructor.instructorInfo.education}</span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {instructor.stats?.activeClasses || 0}
                </p>
                <p className="text-xs text-gray-500">Active Classes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {instructor.stats?.totalStudents || 0}
                </p>
                <p className="text-xs text-gray-500">Students</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {/* <button
                onClick={() => openAssignModal(instructor)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                <BookOpen className="w-4 h-4" />
                Assign Class
              </button> */}
              <button
                onClick={() => openDeleteModal(instructor)}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Remove This Instructor From DTT System
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredInstructors.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No instructors found
        </div>
      )}

      {/* Create Instructor Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Create New Instructor
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateInstructor} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={createForm.firstname}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        firstname: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={createForm.lastname}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, lastname: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={createForm.email}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={createForm.password}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, password: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={createForm.phone}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <input
                    type="text"
                    value={createForm.position}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, position: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5 năm"
                    value={createForm.experience}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        experience: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialization
                </label>
                <input
                  type="text"
                  placeholder="e.g. TOEIC, IELTS"
                  value={createForm.specialization}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      specialization: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Education
                </label>
                <input
                  type="text"
                  placeholder="e.g. Thạc sĩ ngôn ngữ anh"
                  value={createForm.education}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, education: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  value={createForm.bio}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, bio: e.target.value })
                  }
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Instructor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Class Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Assign Class</h2>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAssignClass} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructor
                </label>
                <input
                  type="text"
                  disabled
                  value={`${selectedInstructor?.profile.lastname} ${selectedInstructor?.profile.firstname}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Class *
                </label>
                <select
                  required
                  value={assignForm.classId}
                  onChange={(e) =>
                    setAssignForm({ ...assignForm, classId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select a class --</option>
                  {availableClasses.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.classCode} -{" "}
                      {cls.courseId?.title || "Unknown Course"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Confirm Delete
              </h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to remove{" "}
              <strong>
                {selectedInstructor?.profile.lastname}{" "}
                {selectedInstructor?.profile.firstname}
              </strong>{" "}
              as an instructor? This will convert their account to a regular
              user account.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteInstructor}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorManagement;
