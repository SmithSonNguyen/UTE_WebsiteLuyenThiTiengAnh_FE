// src/components/profile/ProfileInfo.jsx
/**
 * Trang profile với avatar, info editable, nút update. Thêm components riêng cho profile để tối ưu.
 * ProfileInfo.jsx (components/profile/ProfileInfo.jsx - Reusable cho hiển thị/edit info)
 */
import React from "react";
import Input from "../common/Input";

const ProfileInfo = ({ register, errors, isEditing }) => {
  return (
    <div className="space-y-4">
      <Input
        label="Full Name"
        register={register("name")}
        error={errors.name}
        disabled={!isEditing}
      />
      <Input
        label="Email"
        type="email"
        register={register("email")}
        error={errors.email}
        disabled={!isEditing}
      />
      <Input
        label="Password"
        type="password"
        register={register("password")}
        error={errors.password}
        disabled={!isEditing}
        placeholder="Leave blank to keep current"
      />
    </div>
  );
};

export default ProfileInfo;
