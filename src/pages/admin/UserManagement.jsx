import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Users,
  Trash2,
  Mail,
  Phone,
  Calendar,
  X,
  Search,
  BookOpen,
  CreditCard,
  GraduationCap,
  ChevronRight,
  DollarSign,
  Clock,
  CheckCircle,
  RotateCcw,
} from "lucide-react";
import { toast } from "react-toastify";

const UserManagement = () => {
  const accessToken = useSelector((state) => state.auth.login.accessToken);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("active"); // "active" or "deleted"

  // Modal states
  const [showEnrollmentsModal, setShowEnrollmentsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [enrollmentsData, setEnrollmentsData] = useState(null);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [accessToken]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch users");

      const result = await response.json();
      setUsers(result.data.users);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserEnrollments = async (userId) => {
    try {
      setLoadingEnrollments(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/users/${userId}/enrollments`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch enrollments");

      const result = await response.json();
      setEnrollmentsData(result.data);
    } catch (err) {
      toast.error("Lỗi khi tải enrollments: " + err.message);
    } finally {
      setLoadingEnrollments(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/users/${selectedUser._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete user");
      }

      toast.success("Xóa người dùng thành công!");
      setShowDeleteModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      toast.error("Lỗi: " + err.message);
    }
  };

  const handleRestoreUser = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/users/${
          selectedUser._id
        }/restore`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to restore user");
      }

      toast.success("Khôi phục người dùng thành công!");
      setShowRestoreModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      toast.error("Lỗi: " + err.message);
    }
  };

  const openEnrollmentsModal = async (user) => {
    setSelectedUser(user);
    setShowEnrollmentsModal(true);
    await fetchUserEnrollments(user._id);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const openRestoreModal = (user) => {
    setSelectedUser(user);
    setShowRestoreModal(true);
  };

  const filteredUsers = users.filter((user) => {
    const fullName =
      `${user.profile.lastname} ${user.profile.firstname}`.toLowerCase();
    const email = user.profile.email.toLowerCase();
    const search = searchTerm.toLowerCase();
    const matchesSearch = fullName.includes(search) || email.includes(search);

    // Filter by tab: active users (not deleted) or deleted users
    const matchesTab =
      activeTab === "active" ? !user.isDeleted : user.isDeleted;

    return matchesSearch && matchesTab;
  });

  const activeUsersCount = users.filter((user) => !user.isDeleted).length;
  const deletedUsersCount = users.filter((user) => user.isDeleted).length;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-gray-500">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-500">
            Manage guest users and their enrollments
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">
              {activeUsersCount}
            </p>
            <p className="text-sm text-gray-500">Active Users</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-red-600">
              {deletedUsersCount}
            </p>
            <p className="text-sm text-gray-500">Deleted Users</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg p-1 border border-gray-200 flex gap-2">
        <button
          onClick={() => setActiveTab("active")}
          className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium ${
            activeTab === "active"
              ? "bg-blue-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Users className="w-5 h-5" />
            <span>Active Users ({activeUsersCount})</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab("deleted")}
          className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium ${
            activeTab === "deleted"
              ? "bg-red-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Trash2 className="w-5 h-5" />
            <span>Deleted Users ({deletedUsersCount})</span>
          </div>
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

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
          >
            {/* Avatar and Basic Info */}
            <div className="flex items-start gap-4 mb-4">
              <img
                src={user.profile.avatar || "https://via.placeholder.com/80"}
                alt={`${user.profile.firstname} ${user.profile.lastname}`}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800">
                  {user.profile.lastname} {user.profile.firstname}
                </h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 break-all">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="break-all">{user.profile.email}</span>
                </p>
                {user.profile.phone && (
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {user.profile.phone}
                  </p>
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="space-y-2 mb-4 text-sm">
              {user.profile.birthday && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Birthday: {formatDate(user.profile.birthday)}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" />
                <span>Role: {user.role}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle
                  className={`w-4 h-4 ${
                    user.isVerified ? "text-green-500" : "text-gray-400"
                  }`}
                />
                <span
                  className={
                    user.isVerified ? "text-green-600" : "text-gray-500"
                  }
                >
                  {user.isVerified ? "Verified" : "Not Verified"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => openEnrollmentsModal(user)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                <BookOpen className="w-4 h-4" />
                View Enrollments
              </button>
              {activeTab === "active" ? (
                <button
                  onClick={() => openDeleteModal(user)}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              ) : (
                <button
                  onClick={() => openRestoreModal(user)}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restore
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12 text-gray-500">No users found</div>
      )}

      {/* Enrollments Modal */}
      {showEnrollmentsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  User Enrollments
                </h2>
                {selectedUser && (
                  <p className="text-gray-500">
                    {selectedUser.profile.lastname}{" "}
                    {selectedUser.profile.firstname} -{" "}
                    {selectedUser.profile.email}
                  </p>
                )}
              </div>
              <button
                onClick={() => {
                  setShowEnrollmentsModal(false);
                  setEnrollmentsData(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {loadingEnrollments ? (
              <div className="text-center py-8 text-gray-500">
                Loading enrollments...
              </div>
            ) : enrollmentsData ? (
              <div className="space-y-6">
                {/* Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                      <BookOpen className="w-5 h-5" />
                      <p className="text-sm font-medium">Total Enrollments</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-700">
                      {enrollmentsData.statistics.totalEnrollments}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-600 mb-1">
                      <DollarSign className="w-5 h-5" />
                      <p className="text-sm font-medium">Total Spent</p>
                    </div>
                    <p className="text-2xl font-bold text-green-700">
                      {formatCurrency(enrollmentsData.statistics.totalSpent)}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-purple-600 mb-1">
                      <GraduationCap className="w-5 h-5" />
                      <p className="text-sm font-medium">With Class</p>
                    </div>
                    <p className="text-2xl font-bold text-purple-700">
                      {enrollmentsData.statistics.coursesWithClass}
                    </p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-orange-600 mb-1">
                      <BookOpen className="w-5 h-5" />
                      <p className="text-sm font-medium">Without Class</p>
                    </div>
                    <p className="text-2xl font-bold text-orange-700">
                      {enrollmentsData.statistics.coursesWithoutClass}
                    </p>
                  </div>
                </div>

                {/* Enrollments List */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Enrollment History
                  </h3>
                  <div className="space-y-4">
                    {enrollmentsData.enrollments.map((enrollment) => (
                      <div
                        key={enrollment._id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={
                              enrollment.course?.thumbnail ||
                              "https://via.placeholder.com/100"
                            }
                            alt={enrollment.course?.title}
                            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-800 mb-1">
                              {enrollment.course?.title || "Unknown Course"}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {enrollment.course?.description}
                            </p>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <CreditCard className="w-4 h-4" />
                                <span>{formatCurrency(enrollment.amount)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{formatDate(enrollment.createdAt)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <CheckCircle
                                  className={`w-4 h-4 ${
                                    enrollment.status === "completed"
                                      ? "text-green-500"
                                      : "text-yellow-500"
                                  }`}
                                />

                                <span
                                  className={
                                    enrollment.status === "completed"
                                      ? "text-green-600"
                                      : "text-yellow-600"
                                  }
                                >
                                  Payment {enrollment.status}
                                </span>
                              </div>
                            </div>

                            {/* Class Info */}
                            {enrollment.class && enrollment.class.classCode && (
                              <div className="mt-3 bg-blue-50 rounded-lg p-3">
                                <p className="font-semibold text-blue-700 mb-2">
                                  Class: {enrollment.class.classCode}
                                </p>
                                <div className="text-sm text-gray-600 space-y-1">
                                  {enrollment.class.schedule && (
                                    <>
                                      <p>
                                        Days:{" "}
                                        {enrollment.class.schedule.days?.join(
                                          ", "
                                        )}
                                      </p>
                                      <p>
                                        Time:{" "}
                                        {enrollment.class.schedule.startTime} -{" "}
                                        {enrollment.class.schedule.endTime}
                                      </p>
                                      <p>
                                        Start Date:{" "}
                                        {formatDate(
                                          enrollment.class.schedule.startDate
                                        )}
                                      </p>
                                      <p>
                                        Duration:{" "}
                                        {
                                          enrollment.class.schedule
                                            .durationWeeks
                                        }{" "}
                                        weeks
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {enrollmentsData.enrollments.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No enrollments found
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Failed to load enrollments
              </div>
            )}
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
              Are you sure you want to delete user{" "}
              <strong>
                {selectedUser?.profile.lastname}{" "}
                {selectedUser?.profile.firstname}
              </strong>{" "}
              ({selectedUser?.profile.email})? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restore Confirmation Modal */}
      {showRestoreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Confirm Restore
              </h2>
              <button
                onClick={() => setShowRestoreModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to restore user{" "}
              <strong>
                {selectedUser?.profile.lastname}{" "}
                {selectedUser?.profile.firstname}
              </strong>{" "}
              ({selectedUser?.profile.email})? This user will be able to access
              the system again.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRestoreModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRestoreUser}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Restore
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
