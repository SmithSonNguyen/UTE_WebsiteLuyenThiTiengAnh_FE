import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  BookOpen,
  Plus,
  Trash2,
  Edit,
  Calendar,
  Clock,
  Video,
  X,
  Search,
  Filter,
  UserCheck,
} from "lucide-react";
import { toast } from "react-toastify";

const ClassManagement = () => {
  const accessToken = useSelector((state) => state.auth.login.accessToken);

  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showChangeInstructorModal, setShowChangeInstructorModal] =
    useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  // Form states
  const [createForm, setCreateForm] = useState({
    courseId: "",
    classId: "",
    instructorId: "",
    schedule: {
      days: [],
      meetLink: "",
      startTime: "",
      endTime: "",
      startDate: "",
      durationWeeks: "",
    },
    capacity: {
      maxStudents: "",
    },
    status: "scheduled",
  });

  const [changeInstructorForm, setChangeInstructorForm] = useState({
    instructorId: "",
  });

  const daysOfWeek = [
    { en: "Monday", vn: "Thứ 2" },
    { en: "Tuesday", vn: "Thứ 3" },
    { en: "Wednesday", vn: "Thứ 4" },
    { en: "Thursday", vn: "Thứ 5" },
    { en: "Friday", vn: "Thứ 6" },
    { en: "Saturday", vn: "Thứ 7" },
    { en: "Sunday", vn: "Chủ nhật" },
  ];

  const statusColors = {
    scheduled: "bg-blue-100 text-blue-700",
    ongoing: "bg-green-100 text-green-700",
    completed: "bg-gray-100 text-gray-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const statusLabels = {
    scheduled: "Scheduled",
    ongoing: "Ongoing",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  useEffect(() => {
    fetchClasses();
    fetchCourses();
    fetchInstructors();
  }, [accessToken]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const url = filterStatus
        ? `${
            import.meta.env.VITE_BACKEND_URL
          }/admin/classes?status=${filterStatus}`
        : `${import.meta.env.VITE_BACKEND_URL}/admin/classes`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch classes");

      const result = await response.json();
      setClasses(result.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching classes:", err);
      setError(err.message);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      setDataLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/courses`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch courses");

      const result = await response.json();
      console.log("Courses response:", result);

      // Xử lý cả 2 format: result.data và result.result.courses
      const coursesData = result.data || result.result?.courses || [];
      setCourses(coursesData);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setCourses([]);
    } finally {
      setDataLoading(false);
    }
  };

  const fetchInstructors = async () => {
    try {
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
      console.log("Instructors response:", result);
      setInstructors(result.data || []);
    } catch (err) {
      console.error("Error fetching instructors:", err);
      setInstructors([]);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        ...createForm,
        schedule: {
          ...createForm.schedule,
          startDate: new Date(createForm.schedule.startDate).toISOString(),
          durationWeeks: parseInt(createForm.schedule.durationWeeks),
        },
        capacity: {
          maxStudents: parseInt(createForm.capacity.maxStudents),
        },
      };

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/classes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create class");
      }

      toast.success("Tạo lớp học thành công!");
      setShowCreateModal(false);
      resetCreateForm();
      fetchClasses();
    } catch (err) {
      toast.error("Lỗi: " + err.message);
    }
  };

  const handleChangeInstructor = async (e) => {
    e.preventDefault();
    if (!selectedClass) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/classes/${
          selectedClass._id
        }/instructor`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(changeInstructorForm),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to change instructor");
      }

      toast.success("Thay đổi giảng viên thành công!");
      setShowChangeInstructorModal(false);
      setSelectedClass(null);
      setChangeInstructorForm({ instructorId: "" });
      fetchClasses();
    } catch (err) {
      toast.error("Lỗi: " + err.message);
    }
  };

  const handleDeleteClass = async () => {
    if (!selectedClass) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/classes/${
          selectedClass._id
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
        throw new Error(error.message || "Failed to delete class");
      }

      toast.success("Xóa lớp học thành công!");
      setShowDeleteModal(false);
      setSelectedClass(null);
      fetchClasses();
    } catch (err) {
      toast.error("Lỗi: " + err.message);
    }
  };

  const resetCreateForm = () => {
    setCreateForm({
      courseId: "",
      classId: "",
      instructorId: "",
      schedule: {
        days: [],
        meetLink: "",
        startTime: "",
        endTime: "",
        startDate: "",
        durationWeeks: "",
      },
      capacity: {
        maxStudents: "",
      },
      status: "scheduled",
    });
  };

  const openChangeInstructorModal = (classItem) => {
    setSelectedClass(classItem);
    setChangeInstructorForm({ instructorId: classItem.instructor._id });
    setShowChangeInstructorModal(true);
  };

  const openDeleteModal = (classItem) => {
    setSelectedClass(classItem);
    setShowDeleteModal(true);
  };

  const toggleDay = (day) => {
    const currentDays = createForm.schedule.days;
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];

    setCreateForm({
      ...createForm,
      schedule: { ...createForm.schedule, days: newDays },
    });
  };

  const filteredClasses = classes.filter((classItem) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      classItem.classCode?.toLowerCase().includes(searchLower) ||
      classItem.classId?.toLowerCase().includes(searchLower) ||
      classItem.course?.title?.toLowerCase().includes(searchLower) ||
      classItem.instructor?.name?.toLowerCase().includes(searchLower);

    const matchesStatus = filterStatus
      ? classItem.status === filterStatus
      : true;

    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    fetchClasses();
  }, [filterStatus]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-gray-500">Loading classes...</div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Class Management</h1>
          <p className="text-gray-500">Manage classes and schedules</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={dataLoading}
        >
          <Plus className="w-5 h-5" />
          {dataLoading ? "Loading..." : "Add Class"}
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by class code, ID, course, or instructor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClasses.map((classItem) => (
          <div
            key={classItem._id}
            className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  {classItem.classCode}
                </h3>
                <p className="text-sm text-gray-500">{classItem.classId}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  statusColors[classItem.status]
                }`}
              >
                {statusLabels[classItem.status]}
              </span>
            </div>

            {/* Course Info */}
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700">
                <BookOpen className="w-4 h-4" />
                <span className="font-medium text-sm">
                  {classItem.course.title}
                </span>
              </div>
              <div className="text-xs text-blue-600 mt-1">
                Level: {classItem.course.level}
              </div>
            </div>

            {/* Instructor */}
            <div className="mb-4">
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <UserCheck className="w-4 h-4" />
                <span>{classItem.instructor.name}</span>
              </div>
            </div>

            {/* Schedule */}
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{classItem.schedule.days.join(", ")}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>
                  {classItem.schedule.startTime} - {classItem.schedule.endTime}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Video className="w-4 h-4" />
                <a
                  href={classItem.schedule.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate"
                >
                  Meeting Link
                </a>
              </div>
            </div>

            {/* Capacity */}
            <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-center flex-1">
                <p className="text-2xl font-bold text-purple-600">
                  {classItem.capacity.currentStudents}
                </p>
                <p className="text-xs text-gray-500">Current</p>
              </div>
              <div className="text-gray-400">/</div>
              <div className="text-center flex-1">
                <p className="text-2xl font-bold text-gray-600">
                  {classItem.capacity.maxStudents}
                </p>
                <p className="text-xs text-gray-500">Max</p>
              </div>
              <div className="text-gray-400">=</div>
              <div className="text-center flex-1">
                <p className="text-2xl font-bold text-green-600">
                  {classItem.capacity.availableSlots}
                </p>
                <p className="text-xs text-gray-500">Available</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => openChangeInstructorModal(classItem)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                <Edit className="w-4 h-4" />
                Change Instructor
              </button>
              <button
                onClick={() => openDeleteModal(classItem)}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                disabled={classItem.capacity.currentStudents > 0}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <div className="text-center py-12 text-gray-500">No classes found</div>
      )}

      {/* Create Class Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Create New Class
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetCreateForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course *
                  </label>
                  <select
                    required
                    value={createForm.courseId}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, courseId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Select Course --</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.title} ({course.level})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., CLS001"
                    value={createForm.classId}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, classId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructor *
                </label>
                <select
                  required
                  value={createForm.instructorId}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      instructorId: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select Instructor --</option>
                  {instructors.map((instructor) => (
                    <option key={instructor._id} value={instructor._id}>
                      {instructor.profile.lastname}{" "}
                      {instructor.profile.firstname} -{" "}
                      {instructor.profile.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Schedule */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Days of Week *
                </label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day.en}
                      type="button"
                      onClick={() => toggleDay(day.en)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        createForm.schedule.days.includes(day.en)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {day.vn}
                    </button>
                  ))}
                </div>
                {createForm.schedule.days.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    Please select at least one day
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={createForm.schedule.startTime}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        schedule: {
                          ...createForm.schedule,
                          startTime: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={createForm.schedule.endTime}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        schedule: {
                          ...createForm.schedule,
                          endTime: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Link *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://meet.google.com/..."
                  value={createForm.schedule.meetLink}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      schedule: {
                        ...createForm.schedule,
                        meetLink: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={createForm.schedule.startDate}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        schedule: {
                          ...createForm.schedule,
                          startDate: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (weeks) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g., 12"
                    value={createForm.schedule.durationWeeks}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        schedule: {
                          ...createForm.schedule,
                          durationWeeks: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Capacity and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Students *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g., 20"
                    value={createForm.capacity.maxStudents}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        capacity: {
                          ...createForm.capacity,
                          maxStudents: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status *
                  </label>
                  <select
                    required
                    value={createForm.status}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetCreateForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Instructor Modal */}
      {showChangeInstructorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Change Instructor
              </h2>
              <button
                onClick={() => {
                  setShowChangeInstructorModal(false);
                  setSelectedClass(null);
                  setChangeInstructorForm({ instructorId: "" });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleChangeInstructor} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class
                </label>
                <input
                  type="text"
                  disabled
                  value={`${selectedClass?.classCode} - ${selectedClass?.course.title}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Instructor
                </label>
                <input
                  type="text"
                  disabled
                  value={selectedClass?.instructor.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Instructor *
                </label>
                <select
                  required
                  value={changeInstructorForm.instructorId}
                  onChange={(e) =>
                    setChangeInstructorForm({
                      ...changeInstructorForm,
                      instructorId: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select Instructor --</option>
                  {instructors.map((instructor) => (
                    <option key={instructor._id} value={instructor._id}>
                      {instructor.profile.lastname}{" "}
                      {instructor.profile.firstname} -{" "}
                      {instructor.profile.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowChangeInstructorModal(false);
                    setSelectedClass(null);
                    setChangeInstructorForm({ instructorId: "" });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Change
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
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedClass(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {selectedClass?.capacity.currentStudents > 0 ? (
              <div>
                <p className="text-red-600 mb-4">
                  Cannot delete this class because it has{" "}
                  <strong>{selectedClass.capacity.currentStudents}</strong>{" "}
                  enrolled students.
                </p>
                <p className="text-gray-600 mb-6">
                  Please remove all students before deleting the class.
                </p>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedClass(null);
                  }}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete class{" "}
                  <strong>{selectedClass?.classCode}</strong> (
                  {selectedClass?.classId})? This action cannot be undone.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setSelectedClass(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteClass}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassManagement;
