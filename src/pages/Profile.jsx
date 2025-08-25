// src/pages/Profile.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "../components/common/Button";
import ProfileInfo from "../components/profile/ProfileInfo";

const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
});

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: "User Name", email: "user@example.com" }, // Fetch from API
  });

  const onSubmit = (data) => {
    console.log("Profile update:", data);
    setIsEditing(false);
    // Call API to update
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">User Profile</h2>
        <div className="flex justify-center mb-6">
          <img
            src="https://via.placeholder.com/150"
            alt="Avatar"
            className="w-32 h-32 rounded-full border-4 border-blue-500"
          />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ProfileInfo
            register={register}
            errors={errors}
            isEditing={isEditing}
          />
          <div className="mt-6 flex justify-between">
            <Button
              type="button"
              className="bg-gray-500"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
            {isEditing && (
              <Button type="submit" loading={isSubmitting}>
                Update
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
