import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  X,
  Upload,
  Video,
  DollarSign,
  Users,
  Star,
  Clock,
  Search,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const PreRecordedCourseManagement = () => {
  const accessToken = useSelector((state) => state.auth.login.accessToken);

  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Upload states
  const [uploading, setUploading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  // Form state
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    price: 0,
    discountPrice: 0,
    level: "beginner",
    targetScoreRange: { min: 0, max: 450 },
    features: [""],
    courseStructure: {
      totalSessions: 1,
      hoursPerSession: 1,
      totalHours: 1,
      description: "",
    },
    instructor: "",
    thumbnail: "",
    preRecordedContent: {
      totalTopics: 1,
      totalLessons: 0,
      accessDuration: 12,
      accessDurationUnit: "months",
      downloadable: true,
      certificate: true,
      description: "",
      videoLessons: [{ title: "", url: "", order: 1, questions: [] }],
    },
  });

  const [expandedQuestions, setExpandedQuestions] = useState({});

  useEffect(() => {
    fetchCourses();
    fetchInstructors();
  }, [accessToken]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/courses/pre-recorded`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch courses");
      const result = await response.json();
      setCourses(result.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/instructors`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch instructors");
      const result = await response.json();
      setInstructors(result.data);
    } catch (err) {
      console.error(err);
    }
  };

  const uploadToCloudinary = async (file) => {
    try {
      setUploading(true);

      // Get signature from backend
      const signatureResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/cloudinary-signature`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const { data } = await signatureResponse.json();
      const { signature, timestamp, cloudname, apikey } = data;

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", signature);
      formData.append("timestamp", timestamp);
      formData.append("api_key", apikey);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudname}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) throw new Error("Upload failed");

      const uploadData = await uploadResponse.json();
      return uploadData.secure_url;
    } catch (err) {
      alert("Upload failed: " + err.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => setThumbnailPreview(reader.result);
    reader.readAsDataURL(file);

    // Upload
    const url = await uploadToCloudinary(file);
    if (url) {
      setCourseForm({ ...courseForm, thumbnail: url });
    }
  };

  const addVideoLesson = () => {
    setCourseForm({
      ...courseForm,
      preRecordedContent: {
        ...courseForm.preRecordedContent,
        videoLessons: [
          ...courseForm.preRecordedContent.videoLessons,
          {
            title: "",
            url: "",
            order: courseForm.preRecordedContent.videoLessons.length + 1,
          },
        ],
      },
    });
  };

  const removeVideoLesson = (index) => {
    const newLessons = courseForm.preRecordedContent.videoLessons.filter(
      (_, i) => i !== index
    );
    // Reorder
    newLessons.forEach((lesson, i) => (lesson.order = i + 1));
    setCourseForm({
      ...courseForm,
      preRecordedContent: {
        ...courseForm.preRecordedContent,
        videoLessons: newLessons,
      },
    });
  };

  const updateVideoLesson = (index, field, value) => {
    const newLessons = [...courseForm.preRecordedContent.videoLessons];
    newLessons[index][field] = value;
    setCourseForm({
      ...courseForm,
      preRecordedContent: {
        ...courseForm.preRecordedContent,
        videoLessons: newLessons,
      },
    });
  };

  const toggleQuestionPanel = (videoIndex) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [videoIndex]: !prev[videoIndex],
    }));
  };

  const addQuestion = (videoIndex) => {
    const newLessons = [...courseForm.preRecordedContent.videoLessons];
    if (!newLessons[videoIndex].questions) {
      newLessons[videoIndex].questions = [];
    }
    newLessons[videoIndex].questions.push({
      questionText: "",
      options: [
        { label: "A", text: "" },
        { label: "B", text: "" },
        { label: "C", text: "" },
        { label: "D", text: "" },
      ],
      correctAnswer: "A",
    });
    setCourseForm({
      ...courseForm,
      preRecordedContent: {
        ...courseForm.preRecordedContent,
        videoLessons: newLessons,
      },
    });
  };

  const removeQuestion = (videoIndex, questionIndex) => {
    const newLessons = [...courseForm.preRecordedContent.videoLessons];
    newLessons[videoIndex].questions = newLessons[videoIndex].questions.filter(
      (_, i) => i !== questionIndex
    );
    setCourseForm({
      ...courseForm,
      preRecordedContent: {
        ...courseForm.preRecordedContent,
        videoLessons: newLessons,
      },
    });
  };

  const updateQuestion = (videoIndex, questionIndex, field, value) => {
    const newLessons = [...courseForm.preRecordedContent.videoLessons];
    newLessons[videoIndex].questions[questionIndex][field] = value;
    setCourseForm({
      ...courseForm,
      preRecordedContent: {
        ...courseForm.preRecordedContent,
        videoLessons: newLessons,
      },
    });
  };

  const updateQuestionOption = (videoIndex, questionIndex, optionIndex, value) => {
    const newLessons = [...courseForm.preRecordedContent.videoLessons];
    newLessons[videoIndex].questions[questionIndex].options[optionIndex].text = value;
    setCourseForm({
      ...courseForm,
      preRecordedContent: {
        ...courseForm.preRecordedContent,
        videoLessons: newLessons,
      },
    });
  };

  const addFeature = () => {
    setCourseForm({
      ...courseForm,
      features: [...courseForm.features, ""],
    });
  };

  const removeFeature = (index) => {
    setCourseForm({
      ...courseForm,
      features: courseForm.features.filter((_, i) => i !== index),
    });
  };

  const updateFeature = (index, value) => {
    const newFeatures = [...courseForm.features];
    newFeatures[index] = value;
    setCourseForm({ ...courseForm, features: newFeatures });
  };

  const resetForm = () => {
    setCourseForm({
      title: "",
      description: "",
      price: 0,
      discountPrice: 0,
      level: "beginner",
      targetScoreRange: { min: 0, max: 450 },
      features: [""],
      courseStructure: {
        totalSessions: 1,
        hoursPerSession: 1,
        totalHours: 1,
        description: "",
      },
      instructor: "",
      thumbnail: "",
      preRecordedContent: {
        totalTopics: 1,
        totalLessons: 0,
        accessDuration: 12,
        accessDurationUnit: "months",
        downloadable: true,
        certificate: true,
        description: "",
        videoLessons: [{ title: "", url: "", order: 1, questions: [] }],
      },
    });
    setThumbnailPreview("");
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      // Calculate totalLessons
      const updatedForm = {
        ...courseForm,
        preRecordedContent: {
          ...courseForm.preRecordedContent,
          totalLessons: courseForm.preRecordedContent.videoLessons.length,
        },
      };

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/courses/pre-recorded`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(updatedForm),
        }
      );

      if (!response.ok) throw new Error("Failed to create course");

      alert("Tạo khóa học thành công!");
      setShowCreateModal(false);
      resetForm();
      fetchCourses();
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      // Build payload - exclude courseStructure for pre-recorded courses
      const { courseStructure, ...restForm } = courseForm;
      const updatedForm = {
        ...restForm,
        preRecordedContent: {
          ...courseForm.preRecordedContent,
          totalLessons: courseForm.preRecordedContent.videoLessons.length,
        },
      };

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/courses/pre-recorded/${
          selectedCourse._id
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(updatedForm),
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to update course");
      }

      alert("Cập nhật khóa học thành công!");
      setShowEditModal(false);
      resetForm();
      setSelectedCourse(null);
      fetchCourses();
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/courses/pre-recorded/${
          selectedCourse._id
        }`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete course");
      }

      alert("Xóa khóa học thành công!");
      setShowDeleteModal(false);
      setSelectedCourse(null);
      fetchCourses();
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  const openEditModal = async (course) => {
    setSelectedCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description,
      price: course.price,
      discountPrice: course.discountPrice,
      level: course.level,
      targetScoreRange: course.targetScoreRange,
      features: course.features || [""],
      courseStructure: course.courseStructure || {
        totalSessions: 1,
        hoursPerSession: 1,
        totalHours: 1,
        description: "",
      },
      instructor: course.instructor?._id || course.instructor,
      thumbnail: course.thumbnail,
      preRecordedContent: course.preRecordedContent || {
        totalTopics: 1,
        totalLessons: 0,
        accessDuration: 12,
        accessDurationUnit: "months",
        downloadable: true,
        certificate: true,
        description: "",
        videoLessons: [{ title: "", url: "", order: 1, questions: [] }],
      },
    });
    setThumbnailPreview(course.thumbnail);
    setShowEditModal(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-gray-500">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Pre-Recorded Courses
          </h1>
          <p className="text-gray-500">Manage pre-recorded TOEIC courses</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Course
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course._id}
            className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
          >
            {/* Thumbnail */}
            <div className="relative h-48 bg-gray-200">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/400x300?text=Course";
                }}
              />
              <span className="absolute top-2 right-2 px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded">
                {course.level}
              </span>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                {course.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {course.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 mb-3 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Video className="w-4 h-4" />
                  <span>
                    {course.preRecordedContent?.totalLessons || 0} lessons
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.courseStructure?.totalHours || 0}h</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{course.studentsCount || 0} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{course.rating?.average || 0}</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold text-blue-600">
                  {formatCurrency(course.discountPrice)}
                </span>
                {course.price !== course.discountPrice && (
                  <>
                    <span className="text-sm text-gray-400 line-through">
                      {formatCurrency(course.price)}
                    </span>
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                      -{course.discountPercent}%
                    </span>
                  </>
                )}
              </div>

              {/* Instructor */}
              {course.instructor && (
                <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                  <img
                    src={
                      course.instructor.profile?.avatar ||
                      "https://via.placeholder.com/32"
                    }
                    alt="Instructor"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm text-gray-600">
                    {course.instructor.profile?.lastname}{" "}
                    {course.instructor.profile?.firstname}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(course)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    setSelectedCourse(course);
                    setShowDeleteModal(true);
                  }}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12 text-gray-500">No courses found</div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {showCreateModal ? "Create New Course" : "Edit Course"}
              </h2>
              <button
                onClick={() => {
                  showCreateModal
                    ? setShowCreateModal(false)
                    : setShowEditModal(false);
                  resetForm();
                  setSelectedCourse(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form
              onSubmit={
                showCreateModal ? handleCreateCourse : handleUpdateCourse
              }
              className="space-y-6 max-h-[70vh] overflow-y-auto pr-2"
            >
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700">
                  Basic Information
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={courseForm.title}
                    onChange={(e) =>
                      setCourseForm({ ...courseForm, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    required
                    value={courseForm.description}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        description: e.target.value,
                      })
                    }
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Level *
                    </label>
                    <select
                      required
                      value={courseForm.level}
                      onChange={(e) =>
                        setCourseForm({ ...courseForm, level: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instructor *
                    </label>
                    <select
                      required
                      value={courseForm.instructor}
                      onChange={(e) =>
                        setCourseForm({
                          ...courseForm,
                          instructor: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Instructor</option>
                      {instructors.map((inst) => (
                        <option key={inst._id} value={inst._id}>
                          {inst.profile.lastname} {inst.profile.firstname}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thumbnail *
                  </label>
                  <div className="flex items-center gap-4">
                    {thumbnailPreview && (
                      <img
                        src={thumbnailPreview}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                    <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                      <Upload className="w-4 h-4" />
                      {uploading ? "Uploading..." : "Upload Image"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700">Pricing</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (VND) *
                    </label>
                    <input
                      type="number"
                      required
                      value={courseForm.price}
                      onChange={(e) =>
                        setCourseForm({
                          ...courseForm,
                          price: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Price (VND)
                    </label>
                    <input
                      type="number"
                      value={courseForm.discountPrice}
                      onChange={(e) =>
                        setCourseForm({
                          ...courseForm,
                          discountPrice: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Structure Description
                  </label>
                  <input
                    type="text"
                    value={courseForm.courseStructure.description}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        courseStructure: {
                          ...courseForm.courseStructure,
                          description: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Pre-recorded Content */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700">
                  Pre-recorded Content
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Access Duration
                    </label>
                    <input
                      type="number"
                      value={courseForm.preRecordedContent.accessDuration}
                      onChange={(e) =>
                        setCourseForm({
                          ...courseForm,
                          preRecordedContent: {
                            ...courseForm.preRecordedContent,
                            accessDuration: parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration Unit
                    </label>
                    <select
                      value={courseForm.preRecordedContent.accessDurationUnit}
                      onChange={(e) =>
                        setCourseForm({
                          ...courseForm,
                          preRecordedContent: {
                            ...courseForm.preRecordedContent,
                            accessDurationUnit: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="days">Days</option>
                      <option value="months">Months</option>
                      <option value="years">Years</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={courseForm.preRecordedContent.downloadable}
                      onChange={(e) =>
                        setCourseForm({
                          ...courseForm,
                          preRecordedContent: {
                            ...courseForm.preRecordedContent,
                            downloadable: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4"
                    />
                    <label className="text-sm text-gray-700">
                      Downloadable
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={courseForm.preRecordedContent.certificate}
                      onChange={(e) =>
                        setCourseForm({
                          ...courseForm,
                          preRecordedContent: {
                            ...courseForm.preRecordedContent,
                            certificate: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4"
                    />
                    <label className="text-sm text-gray-700">Certificate</label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content Description
                  </label>
                  <textarea
                    value={courseForm.preRecordedContent.description}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        preRecordedContent: {
                          ...courseForm.preRecordedContent,
                          description: e.target.value,
                        },
                      })
                    }
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Video Lessons */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-700">Video Lessons</h3>
                  <button
                    type="button"
                    onClick={addVideoLesson}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Video className="w-4 h-4" />
                    Add Video
                  </button>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {courseForm.preRecordedContent.videoLessons.map(
                    (lesson, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        {/* Video info row */}
                        <div className="flex gap-2 items-start p-3 bg-gray-50">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                            {index + 1}
                          </div>
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              value={lesson.title}
                              onChange={(e) =>
                                updateVideoLesson(index, "title", e.target.value)
                              }
                              placeholder="Lesson title"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                            <input
                              type="url"
                              value={lesson.url}
                              onChange={(e) =>
                                updateVideoLesson(index, "url", e.target.value)
                              }
                              placeholder="YouTube URL"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            {/* Toggle questions */}
                            <button
                              type="button"
                              onClick={() => toggleQuestionPanel(index)}
                              className="flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 text-xs"
                              title="Quản lý câu hỏi"
                            >
                              <HelpCircle className="w-3.5 h-3.5" />
                              <span>{lesson.questions?.length || 0} Q</span>
                              {expandedQuestions[index] ? (
                                <ChevronUp className="w-3 h-3" />
                              ) : (
                                <ChevronDown className="w-3 h-3" />
                              )}
                            </button>
                            {/* Remove video */}
                            {courseForm.preRecordedContent.videoLessons.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeVideoLesson(index)}
                                className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Questions panel */}
                        {expandedQuestions[index] && (
                          <div className="p-3 bg-white border-t border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-medium text-gray-700">
                                Câu hỏi sau video ({lesson.questions?.length || 0})
                              </span>
                              <button
                                type="button"
                                onClick={() => addQuestion(index)}
                                className="flex items-center gap-1 text-xs px-2 py-1 bg-green-50 text-green-700 rounded hover:bg-green-100"
                              >
                                <Plus className="w-3 h-3" />
                                Thêm câu hỏi
                              </button>
                            </div>

                            {(!lesson.questions || lesson.questions.length === 0) && (
                              <p className="text-xs text-gray-400 italic text-center py-2">
                                Chưa có câu hỏi nào. Nhấn "Thêm câu hỏi" để bắt đầu.
                              </p>
                            )}

                            <div className="space-y-4">
                              {(lesson.questions || []).map((question, qIndex) => (
                                <div
                                  key={qIndex}
                                  className="border border-indigo-100 rounded-lg p-3 bg-indigo-50/30"
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <span className="text-xs font-semibold text-indigo-600">
                                      Câu {qIndex + 1}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => removeQuestion(index, qIndex)}
                                      className="p-1 text-red-400 hover:text-red-600"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>

                                  {/* Question text */}
                                  <input
                                    type="text"
                                    value={question.questionText}
                                    onChange={(e) =>
                                      updateQuestion(index, qIndex, "questionText", e.target.value)
                                    }
                                    placeholder="Nội dung câu hỏi..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-3 focus:ring-2 focus:ring-indigo-400"
                                  />

                                  {/* Options A/B/C/D */}
                                  <div className="space-y-2 mb-3">
                                    {(question.options || []).map((opt, oIndex) => (
                                      <div key={oIndex} className="flex items-center gap-2">
                                        <span className="w-6 h-6 flex-shrink-0 flex items-center justify-center bg-gray-200 rounded-full text-xs font-bold text-gray-600">
                                          {opt.label}
                                        </span>
                                        <input
                                          type="text"
                                          value={opt.text}
                                          onChange={(e) =>
                                            updateQuestionOption(index, qIndex, oIndex, e.target.value)
                                          }
                                          placeholder={`Đáp án ${opt.label}...`}
                                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-indigo-400"
                                        />
                                      </div>
                                    ))}
                                  </div>

                                  {/* Correct answer */}
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-600 font-medium">Đáp án đúng:</span>
                                    {['A','B','C','D'].map((label) => (
                                      <label key={label} className="flex items-center gap-1 cursor-pointer">
                                        <input
                                          type="radio"
                                          name={`correct-${index}-${qIndex}`}
                                          value={label}
                                          checked={question.correctAnswer === label}
                                          onChange={() =>
                                            updateQuestion(index, qIndex, "correctAnswer", label)
                                          }
                                          className="w-3 h-3 accent-green-600"
                                        />
                                        <span className="text-xs font-semibold text-green-700">{label}</span>
                                      </label>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => {
                    showCreateModal
                      ? setShowCreateModal(false)
                      : setShowEditModal(false);
                    resetForm();
                    setSelectedCourse(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {showCreateModal ? "Create Course" : "Update Course"}
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
              Are you sure you want to delete{" "}
              <strong>{selectedCourse?.title}</strong>? This action will set the
              course status to inactive.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCourse}
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

export default PreRecordedCourseManagement;
