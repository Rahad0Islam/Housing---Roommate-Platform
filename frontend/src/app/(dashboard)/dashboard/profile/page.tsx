"use client";

import { useState } from "react";
import {
  useGetMe,
  useUpdateProfile,
  useUploadProfileImage,
  useChangePassword,
} from "@/hooks/auth.hook";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Camera, Upload, Check } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const { data: userResponse, isLoading: isLoadingUser, refetch } = useGetMe();
  const user = userResponse?.data;

  const [name, setName] = useState(user?.name || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdateProfile();
  const { mutate: uploadImage, isPending: isUploadingImage } =
    useUploadProfileImage();
  const { mutate: changePassword, isPending: isChangingPassword } =
    useChangePassword();

  if (isLoadingUser) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleUpdateName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name is required");

    updateProfile(
      { name },
      {
        onSuccess: () => {
          toast.success("Profile updated successfully");
          refetch();
        },
        onError: (err: any) => {
          toast.error(
            err.response?.data?.message ||
              err.message ||
              "Failed to update profile",
          );
        },
      },
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUploadImage = () => {
    if (!imageFile) return toast.error("Please select an image first");

    uploadImage(imageFile, {
      onSuccess: () => {
        toast.success("Profile image updated successfully");
        setImageFile(null);
        setImagePreview(null);
        refetch();
      },
      onError: (err: any) => {
        toast.error(
          err.response?.data?.message ||
            err.message ||
            "Failed to upload image",
        );
      },
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match");
    }

    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }

    changePassword(
      { oldPassword, newPassword },
      {
        onSuccess: () => {
          toast.success("Password changed successfully");
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
        onError: (err: any) => {
          toast.error(
            err.response?.data?.message ||
              err.message ||
              "Failed to change password",
          );
        },
      },
    );
  };

  // Initialize name if user data was fetched after mount
  if (user && !name && name !== user.name) {
    setName(user.name);
  }

  return (
    <div className="gradient-mesh motion-rise mx-auto max-w-4xl py-8">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Your account
        </p>
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Profile Settings
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {/* Profile Image Card */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Image</CardTitle>
              <CardDescription>Update your profile picture.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-muted bg-gray-100 flex items-center justify-center">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                ) : user?.profileImage ? (
                  <Image
                    src={user.profileImage}
                    alt={user.name}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                ) : (
                  <Camera className="h-10 w-10 text-gray-400" />
                )}
              </div>
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="max-w-[250px]"
                  />
                  {imageFile && (
                    <Button
                      onClick={handleUploadImage}
                      disabled={isUploadingImage}
                    >
                      {isUploadingImage ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="mr-2 h-4 w-4" />
                      )}
                      Upload
                    </Button>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Recommended size: 500x500px. Maximum file size: 2MB.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your basic account details.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdateName}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isUpdatingProfile}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input
                    value={user?.email || ""}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email addresses cannot be changed.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  disabled={isUpdatingProfile || name === user?.name}
                >
                  {isUpdatingProfile ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="mr-2 h-4 w-4" />
                  )}
                  Save Changes
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Ensure your account is using a long, random password to stay
                secure.
              </CardDescription>
            </CardHeader>
            {user?.authProvider === "GOOGLE" ? (
              <CardContent>
                <div className="p-4 bg-blue-50 text-blue-800 rounded-md">
                  You logged in using Google. Password changes are managed by
                  your Google account.
                </div>
              </CardContent>
            ) : (
              <form onSubmit={handleChangePassword}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Current Password
                    </label>
                    <Input
                      type="password"
                      placeholder="Enter current password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">New Password</label>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Confirm New Password
                    </label>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    disabled={
                      isChangingPassword ||
                      !oldPassword ||
                      !newPassword ||
                      !confirmPassword
                    }
                  >
                    {isChangingPassword ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </CardFooter>
              </form>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
