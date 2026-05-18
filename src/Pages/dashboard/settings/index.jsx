import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { toast } from "react-hot-toast";
import {
  User, Lock, Camera, Loader2,
  Eye, EyeOff, Save, Shield,
  Mail, Phone, MapPin, AtSign,
  CheckCircle,
} from "lucide-react";

import {
  loadProfile, updateProfile, changePassword,
  selectProfile, selectLoadingProfile,
  selectUpdatingProfile, selectChangingPassword,
} from "../../../store/settingSlice";

// ── Avatar
const Avatar = ({ imagePreview, fullname, onClick }) => (
  <div className="relative group cursor-pointer w-24 h-24 shrink-0"
    onClick={onClick}>
    {imagePreview ? (
      <img src={imagePreview} alt="Profile"
        className="w-24 h-24 rounded-2xl object-cover shadow-md" />
    ) : (
      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br
                      from-emerald-600 to-emerald-400
                      flex items-center justify-center shadow-md">
        <span className="text-white font-black text-3xl">
          {fullname?.charAt(0)?.toUpperCase() || "U"}
        </span>
      </div>
    )}
    <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0
                    group-hover:opacity-100 transition-opacity
                    flex items-center justify-center">
      <Camera size={20} className="text-white" />
    </div>
  </div>
);

// ── Role Badge
const RoleBadge = ({ role }) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1
                    rounded-lg text-xs font-bold uppercase tracking-wide ${
    role === "admin"
      ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400"
      : role === "manager"
        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
  }`}>
    <Shield size={11} />
    {role || "user"}
  </span>
);

// ── Input Field
const InputField = ({ label, icon, type = "text", value, onChange,
                      placeholder, disabled, rightElement }) => (
  <div>
    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400
                      uppercase tracking-wide mb-1.5 block">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full border rounded-xl py-2.5 text-sm
                   focus:outline-none focus:ring-2
                   focus:ring-emerald-300 dark:focus:ring-emerald-700
                   transition-all
                   placeholder:text-gray-400 dark:placeholder:text-gray-500
                   ${icon ? "pl-10" : "pl-3.5"}
                   ${rightElement ? "pr-10" : "pr-3.5"}
                   ${disabled
                     ? "bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500 cursor-not-allowed border-gray-200 dark:border-gray-700"
                     : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-200 dark:border-gray-700"
                   }`}
      />
      {rightElement && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2">
          {rightElement}
        </span>
      )}
    </div>
  </div>
);

// ── Section Card
const SectionCard = ({ title, icon, children }) => (
  <div className="bg-white dark:bg-gray-900
                  rounded-2xl shadow-sm
                  border border-gray-100 dark:border-gray-800
                  overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800
                    flex items-center gap-3">
      <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20
                      rounded-xl text-emerald-700 dark:text-emerald-400">
        {icon}
      </div>
      <h2 className="text-base font-bold text-gray-800 dark:text-white">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

// ── Main Settings Page
const Settings = () => {
  const dispatch         = useDispatch();
  const fileInputRef     = useRef(null);

  const profile          = useSelector(selectProfile);
  const loadingProfile   = useSelector(selectLoadingProfile);
  const updatingProfile  = useSelector(selectUpdatingProfile);
  const changingPassword = useSelector(selectChangingPassword);

  const [profileForm, setProfileForm] = useState({
    fullname: "", username: "", email: "", phone: "", address: "",
  });
  const [selectedImage,  setSelectedImage]  = useState(null);
  const [imagePreview,   setImagePreview]   = useState(null);
  const [passwordForm,   setPasswordForm]   = useState({
    oldPassword: "", newPassword: "", confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false, new: false, confirm: false,
  });

  // Load profile on mount — set form in .then() to avoid useEffect setState warning
  useEffect(() => {
    dispatch(loadProfile()).then((result) => {
      if (result?.payload) {
        const user = result.payload;
        setProfileForm({
          fullname: user.fullname || "",
          username: user.username || "",
          email:    user.email    || "",
          phone:    user.phone    || "",
          address:  user.address  || "",
        });
        setImagePreview(user.profile || null);
      }
    });
  }, [dispatch]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file"); return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB"); return;
    }
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleUpdateProfile = async () => {
    if (!profileForm.fullname.trim()) {
      toast.error("Full name is required"); return;
    }
    const fd = new FormData();
    if (profileForm.fullname) fd.append("fullname", profileForm.fullname);
    if (profileForm.username) fd.append("username", profileForm.username);
    if (profileForm.email)    fd.append("email",    profileForm.email);
    if (profileForm.phone)    fd.append("phone",    profileForm.phone);
    if (profileForm.address)  fd.append("address",  profileForm.address);
    if (selectedImage)        fd.append("profile",  selectedImage);

    const result = await dispatch(updateProfile(fd));
    if (result?.payload === true) {
      setSelectedImage(null);
      // Refresh form with updated profile
      dispatch(loadProfile()).then((res) => {
        if (res?.payload) {
          const user = res.payload;
          setProfileForm({
            fullname: user.fullname || "",
            username: user.username || "",
            email:    user.email    || "",
            phone:    user.phone    || "",
            address:  user.address  || "",
          });
          setImagePreview(user.profile || null);
        }
      });
    }
  };

  const handleChangePassword = async () => {
    const { oldPassword, newPassword, confirmPassword } = passwordForm;
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required"); return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters"); return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match"); return;
    }
    if (oldPassword === newPassword) {
      toast.error("New password cannot be same as old password"); return;
    }
    const result = await dispatch(changePassword({ oldPassword, newPassword }));
    if (result?.payload === true) {
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    }
  };

  const updateField     = (field) => (e) =>
    setProfileForm((p) => ({ ...p, [field]: e.target.value }));
  const updatePassField = (field) => (e) =>
    setPasswordForm((p) => ({ ...p, [field]: e.target.value }));
  const togglePass      = (field) =>
    setShowPasswords((p) => ({ ...p, [field]: !p[field] }));

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50/60 dark:bg-transparent
                      flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Loader2 size={36} className="animate-spin text-emerald-700" />
          <p className="text-sm">Loading settings…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/60 dark:bg-transparent
                    p-4 md:p-6 lg:p-8">

      <Toaster position="top-right" toastOptions={{ style: { zIndex: 9999 },
        success: { style: { background:"#f0fdf4", color:"#166534", border:"1px solid #bbf7d0" }, iconTheme:{ primary:"#16a34a", secondary:"#f0fdf4" } },
        error:   { style: { background:"#fef2f2", color:"#991b1b", border:"1px solid #fecaca" }, iconTheme:{ primary:"#dc2626", secondary:"#fef2f2" } },
      }} />

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-800 dark:text-white">
          Settings
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Manage your account and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT — Profile Summary */}
        <div className="lg:col-span-1 space-y-6">

          {/* Profile Card */}
          <div className="bg-white dark:bg-gray-900
                          rounded-2xl shadow-sm
                          border border-gray-100 dark:border-gray-800
                          p-6 text-center">
            <div className="flex justify-center mb-4">
              <Avatar
                imagePreview={imagePreview}
                fullname={profile?.fullname}
                onClick={() => fileInputRef.current?.click()}
              />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />

            <h3 className="font-black text-lg text-gray-800 dark:text-white">
              {profile?.fullname || "—"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              @{profile?.username || "—"}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {profile?.email || "—"}
            </p>
            <div className="flex justify-center mt-3">
              <RoleBadge role={profile?.role} />
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 flex items-center gap-2 mx-auto text-xs
                         font-medium
                         text-emerald-700 dark:text-emerald-400
                         hover:text-emerald-800 dark:hover:text-emerald-300
                         bg-emerald-50 dark:bg-emerald-900/20
                         px-3 py-1.5 rounded-lg transition-all">
              <Camera size={12} /> Change Photo
            </button>
          </div>

          {/* Account Info */}
          <div className="bg-white dark:bg-gray-900
                          rounded-2xl shadow-sm
                          border border-gray-100 dark:border-gray-800
                          p-5 space-y-3">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500
                          uppercase tracking-widest mb-3">
              Account Info
            </p>
            {[
              { icon: <Mail size={14} />,  label: "Email",   val: profile?.email   || "—" },
              { icon: <Phone size={14} />, label: "Phone",   val: profile?.phone   || "—" },
              { icon: <MapPin size={14} />,label: "Address", val: profile?.address || "—" },
            ].map(({ icon, label, val }) => (
              <div key={label} className="flex items-start gap-3 text-sm">
                <span className="text-gray-400 mt-0.5 shrink-0">{icon}</span>
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-400 dark:text-gray-500
                                uppercase tracking-wide font-medium">
                    {label}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 font-medium truncate">
                    {val}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Forms */}
        <div className="lg:col-span-2 space-y-6">

          {/* Update Profile */}
          <SectionCard title="Update Profile" icon={<User size={16} />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Full Name *" icon={<User size={14} />}
                value={profileForm.fullname}
                onChange={updateField("fullname")}
                placeholder="e.g. Ahmad Ali" />
              <InputField
                label="Username" icon={<AtSign size={14} />}
                value={profileForm.username}
                onChange={updateField("username")}
                placeholder="e.g. ahmad_ali" />
              <InputField
                label="Email" icon={<Mail size={14} />} type="email"
                value={profileForm.email}
                onChange={updateField("email")}
                placeholder="e.g. ahmad@example.com" />
              <InputField
                label="Phone" icon={<Phone size={14} />} type="tel"
                value={profileForm.phone}
                onChange={updateField("phone")}
                placeholder="e.g. 0300-1234567" />
              <div className="sm:col-span-2">
                <InputField
                  label="Address" icon={<MapPin size={14} />}
                  value={profileForm.address}
                  onChange={updateField("address")}
                  placeholder="e.g. Lahore, Punjab, Pakistan" />
              </div>
            </div>

            {/* Image hint */}
            <div className="mt-4 p-3
                            bg-emerald-50 dark:bg-emerald-900/20
                            border border-emerald-100 dark:border-emerald-800
                            rounded-xl flex items-center gap-3">
              <Camera size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                {imagePreview && imagePreview !== profile?.profile
                  ? "New photo selected — will be uploaded on save"
                  : "Click your avatar or 'Change Photo' to update picture"}
              </p>
            </div>

            <div className="flex justify-end mt-5">
              <button
                onClick={handleUpdateProfile}
                disabled={updatingProfile}
                className="flex items-center gap-2 bg-emerald-700 text-white
                           px-6 py-2.5 rounded-xl text-sm font-medium
                           hover:bg-emerald-800 transition-colors disabled:opacity-60">
                {updatingProfile
                  ? <><Loader2 size={14} className="animate-spin" /> Saving…</>
                  : <><Save size={14} /> Save Changes</>}
              </button>
            </div>
          </SectionCard>

          {/* Change Password */}
          <SectionCard title="Change Password" icon={<Lock size={16} />}>
            <div className="space-y-4">

              <InputField
                label="Current Password *" icon={<Lock size={14} />}
                type={showPasswords.old ? "text" : "password"}
                value={passwordForm.oldPassword}
                onChange={updatePassField("oldPassword")}
                placeholder="Enter current password"
                rightElement={
                  <button type="button" onClick={() => togglePass("old")}
                    className="text-gray-400 hover:text-gray-600
                               dark:hover:text-gray-300 transition-colors">
                    {showPasswords.old ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                } />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="New Password *" icon={<Lock size={14} />}
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={updatePassField("newPassword")}
                  placeholder="Min. 6 characters"
                  rightElement={
                    <button type="button" onClick={() => togglePass("new")}
                      className="text-gray-400 hover:text-gray-600
                                 dark:hover:text-gray-300">
                      {showPasswords.new ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  } />
                <InputField
                  label="Confirm New Password *" icon={<Lock size={14} />}
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={updatePassField("confirmPassword")}
                  placeholder="Repeat new password"
                  rightElement={
                    <button type="button" onClick={() => togglePass("confirm")}
                      className="text-gray-400 hover:text-gray-600
                                 dark:hover:text-gray-300">
                      {showPasswords.confirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  } />
              </div>

              {/* Password strength hints */}
              {passwordForm.newPassword && (
                <div className="space-y-2">
                  {[
                    {
                      ok:  passwordForm.newPassword.length >= 6,
                      msg: "At least 6 characters",
                    },
                    {
                      ok:  passwordForm.newPassword !== passwordForm.oldPassword,
                      msg: "Different from current password",
                    },
                    {
                      ok:  passwordForm.newPassword === passwordForm.confirmPassword
                           && passwordForm.confirmPassword.length > 0,
                      msg: "Passwords match",
                    },
                  ].map(({ ok, msg }) => (
                    <div key={msg} className="flex items-center gap-2 text-xs">
                      <CheckCircle
                        size={12}
                        className={ok
                          ? "text-emerald-500"
                          : "text-gray-300 dark:text-gray-600"}
                      />
                      <span className={ok
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-gray-400 dark:text-gray-500"}>
                        {msg}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end mt-2">
                <button
                  onClick={handleChangePassword}
                  disabled={changingPassword}
                  className="flex items-center gap-2 bg-emerald-700 text-white
                             px-6 py-2.5 rounded-xl text-sm font-medium
                             hover:bg-emerald-800 transition-colors disabled:opacity-60">
                  {changingPassword
                    ? <><Loader2 size={14} className="animate-spin" /> Updating…</>
                    : <><Lock size={14} /> Update Password</>}
                </button>
              </div>
            </div>
          </SectionCard>

        </div>
      </div>
    </div>
  );
};

export default Settings;