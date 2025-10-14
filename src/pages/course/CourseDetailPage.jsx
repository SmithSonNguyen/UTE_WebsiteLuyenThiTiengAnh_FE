import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CourseDetail from "@/components/course/CourseDetail";
import { getCourseDetails } from "@/api/courseApi";

const CourseDetailPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const response = await getCourseDetails(id);
        setCourse(response);
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50">
      <CourseDetail course={course} isLoading={isLoading} />
    </div>
  );
};

export default CourseDetailPage;
