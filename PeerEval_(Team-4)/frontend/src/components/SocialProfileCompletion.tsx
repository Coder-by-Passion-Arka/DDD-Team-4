// // 1. Google login → User created with incomplete profile
// // 2. Frontend shows SocialProfileCompletion modal  
// // 3. User fills: phone, address, role
// // 4. Form submits to "/auth/complete-social-profile"
// // 5. Backend updates user with missing fields
// // 6. needsProfileCompletion becomes false

// import React, { useState } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { useToast } from '../hooks/useToast';
// import { apiService } from '../services/api';

// enum UserRole {
//   TEACHER = "teacher",
//   STUDENT = "student",
//   ADMIN = "admin",
// }

// interface SocialProfileCompletionProps {
//   onComplete: (data: any) => void;
//   onCancel: () => void;
// }

// const SocialProfileCompletion: React.FC<SocialProfileCompletionProps> = ({
//   onComplete,
//   onCancel,
// }) => {
//   const { state, completeSocialProfile } = useAuth();
//   const toast = useToast();
//   const [isLoading, setIsLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     userPhoneNumber: "",
//     countryCode: "+91",
//     userLocation: {
//       homeAddress: "",
//       currentAddress: "",
//     },
//     userRole: "student" as UserRole,
//   });

//   const handleInputChange = (
//     event: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >
//   ) => {
//     const { name, value } = event.target;

//     if (name.includes(".")) {
//       const [parent, child] = name.split(".");
//       setFormData((prev) => ({
//         ...prev,
//         [parent]: {
//           ...(prev[parent as keyof typeof prev] as any),
//           [child]: value,
//         },
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   const validateForm = (): string | null => {
//     if (!formData.userPhoneNumber.trim()) {
//       return "Phone number is required";
//     }

//     if (!formData.userLocation.homeAddress.trim()) {
//       return "Home address is required";
//     }

//     if (!formData.userLocation.currentAddress.trim()) {
//       return "Current address is required";
//     }

//     if (!formData.userRole) {
//       return "Please select a role";
//     }

//     return null;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     const validationError = validateForm();
//     if (validationError) {
//       toast.error(validationError, { title: "Validation Error" });
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // Validate required fields
//       // if (!formData.userPhoneNumber || !formData.userLocation.homeAddress || !formData.userLocation.currentAddress) {
//       //   toast.error("All fields are required");
//       //   setIsLoading(false);
//       //   return;
//       // }
//       await toast.promise(completeSocialProfile(formData), {
//         loading: "Completing your profile...",
//         success: "Profile completed successfully!",
//         error: (err) => `Failed to complete profile: ${err.message}`,
//       });

//       // Call API to complete social profile
//       await apiService.patch("/auth/social-profile/complete", formData);

//       toast.success("Profile completed successfully!");

//       onComplete();
//     } catch (error) {
//       console.error("Error completing profile:", error);
//       toast.error("Failed to complete profile. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     toast.warning(
//       "You can complete your profile later from the settings page."
//     );
//     onCancel();
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
//         <div className="text-center mb-6">
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
//             Complete Your Profile
//           </h2>
//           <p className="text-gray-600 dark:text-gray-400">
//             Welcome, {state.user?.userName}! Please provide a few more details
//             to get started.
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="grid grid-cols-3 gap-4">
//             <select
//               name="countryCode"
//               value={formData.countryCode}
//               onChange={handleInputChange}
//               required
//               disabled={isLoading}
//               className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
//             >
//               <option value="+1">+1 (US)</option>
//               <option value="+91">+91 (IN)</option>
//               <option value="+44">+44 (UK)</option>
//               <option value="+33">+33 (FR)</option>
//               <option value="+49">+49 (DE)</option>
//               <option value="+81">+81 (JP)</option>
//               <option value="+86">+86 (CN)</option>
//               <option value="+61">+61 (AU)</option>
//               <option value="+55">+55 (BR)</option>
//             </select>

//             <input
//               type="tel"
//               name="userPhoneNumber"
//               placeholder="Phone Number"
//               value={formData.userPhoneNumber}
//               onChange={handleInputChange}
//               required
//               disabled={isLoading}
//               className="col-span-2 w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
//             />
//           </div>

//           <input
//             type="text"
//             name="userLocation.homeAddress"
//             placeholder="Home Address"
//             value={formData.userLocation.homeAddress}
//             onChange={handleInputChange}
//             required
//             disabled={isLoading}
//             className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
//           />

//           <input
//             type="text"
//             name="userLocation.currentAddress"
//             placeholder="Current Address"
//             value={formData.userLocation.currentAddress}
//             onChange={handleInputChange}
//             required
//             disabled={isLoading}
//             className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
//           />

//           {/* TODO: Implement Bio in Form */}
//           {/* <textarea
//             name="userBio"
//             placeholder="Tell us about yourself (optional)"
//             value={formData.userBio}
//             onChange={handleInputChange}
//             disabled={isLoading}
//             rows={3}
//             className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 resize-none"
//           /> */}

//           <div className="space-y-3">
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//               Select Your Role <span className="text-red-500">*</span>
//             </label>
//             <div className="grid grid-cols-1 gap-2">
//               <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
//                 <input
//                   type="radio"
//                   name="userRole"
//                   value={UserRole.STUDENT}
//                   checked={formData.userRole === UserRole.STUDENT}
//                   onChange={handleInputChange}
//                   disabled={isLoading}
//                   className="text-indigo-600 focus:ring-indigo-500"
//                 />
//                 <div>
//                   <span className="text-gray-700 dark:text-gray-300 font-medium">
//                     Student
//                   </span>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">
//                     I'm here to learn and complete assignments
//                   </p>
//                 </div>
//               </label>

//               <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
//                 <input
//                   type="radio"
//                   name="userRole"
//                   value={UserRole.TEACHER}
//                   checked={formData.userRole === UserRole.TEACHER}
//                   onChange={handleInputChange}
//                   disabled={isLoading}
//                   className="text-indigo-600 focus:ring-indigo-500"
//                 />
//                 <div>
//                   <span className="text-gray-700 dark:text-gray-300 font-medium">
//                     Teacher
//                   </span>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">
//                     I want to create and manage courses
//                   </p>
//                 </div>
//               </label>

//               <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
//                 <input
//                   type="radio"
//                   name="userRole"
//                   value={UserRole.ADMIN}
//                   checked={formData.userRole === UserRole.ADMIN}
//                   onChange={handleInputChange}
//                   disabled={isLoading}
//                   className="text-indigo-600 focus:ring-indigo-500"
//                 />
//                 <div>
//                   <span className="text-gray-700 dark:text-gray-300 font-medium">
//                     Admin
//                   </span>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">
//                     I need administrative access
//                   </p>
//                 </div>
//               </label>
//             </div>
//           </div>

//           <div className="flex flex-col-reverse sm:flex-row sm:justify-end space-y-3 space-y-reverse sm:space-y-0 sm:space-x-3 pt-4">
//             <button
//               type="button"
//               onClick={handleCancel}
//               disabled={isLoading}
//               className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
//             >
//               Skip for now
//             </button>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center disabled:opacity-50"
//             >
//               {isLoading ? (
//                 <>
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                   Completing...
//                 </>
//               ) : (
//                 "Complete Profile"
//               )}
//             </button>
//           </div>
//         </form>

//         {/* Google Account Info Display */}
//         {state.user?.authProvider === "google" && (
//           <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
//             <div className="flex items-center space-x-3">
//               {state.user.userProfileImage && (
//                 <img
//                   src={state.user.userProfileImage}
//                   alt={state.user.userName}
//                   className="w-10 h-10 rounded-full"
//                 />
//               )}
//               <div>
//                 <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
//                   Signed in with Google
//                 </p>
//                 <p className="text-xs text-blue-700 dark:text-blue-300">
//                   {state.user.userEmail}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SocialProfileCompletion;

// ================================================================= // 

// ✅ CRITICAL FIX: Fixed SocialProfileCompletion.tsx - Removed duplicate API calls and loading states
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';

enum UserRole {
  TEACHER = "teacher",
  STUDENT = "student",
  ADMIN = "admin",
}

interface SocialProfileCompletionProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

const SocialProfileCompletion: React.FC<SocialProfileCompletionProps> = ({
  onComplete,
  onCancel,
}) => {
  const { state } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    userPhoneNumber: "",
    countryCode: "+91",
    userLocation: {
      homeAddress: "",
      currentAddress: "",
    },
    userRole: "student" as UserRole,
  });

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = (): string | null => {
    if (!formData.userPhoneNumber.trim()) {
      return "Phone number is required";
    }

    if (!formData.userLocation.homeAddress.trim()) {
      return "Home address is required";
    }

    if (!formData.userLocation.currentAddress.trim()) {
      return "Current address is required";
    }

    if (!formData.userRole) {
      return "Please select a role";
    }

    return null;
  };

  // ✅ CRITICAL FIX: Removed duplicate API calls and loading states
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError, { title: "Validation Error" });
      return;
    }

    setIsLoading(true); // ✅ FIXED: Only set loading once

    try {
      console.log("🔍 Completing social profile with data:", formData);

      // ✅ FIXED: Only call onComplete, which will handle the API call through AuthContext
      await onComplete(formData);

      console.log("✅ Profile completion successful through onComplete");
    } catch (error) {
      console.error("❌ Error completing profile:", error);
      toast.error("Failed to complete profile. Please try again.", {
        title: "Profile Completion Failed"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    console.log("🚫 User cancelled profile completion");
    toast.warning(
      "You can complete your profile later from the settings page.",
      {
        title: "Profile Completion Skipped"
      }
    );
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Complete Your Profile
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome, {state.user?.userName}! Please provide a few more details
            to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <select
              name="countryCode"
              value={formData.countryCode}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
            >
              <option value="+1">+1 (US)</option>
              <option value="+91">+91 (IN)</option>
              <option value="+44">+44 (UK)</option>
              <option value="+33">+33 (FR)</option>
              <option value="+49">+49 (DE)</option>
              <option value="+81">+81 (JP)</option>
              <option value="+86">+86 (CN)</option>
              <option value="+61">+61 (AU)</option>
              <option value="+55">+55 (BR)</option>
            </select>

            <input
              type="tel"
              name="userPhoneNumber"
              placeholder="Phone Number"
              value={formData.userPhoneNumber}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className="col-span-2 w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
            />
          </div>

          <input
            type="text"
            name="userLocation.homeAddress"
            placeholder="Home Address"
            value={formData.userLocation.homeAddress}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
          />

          <input
            type="text"
            name="userLocation.currentAddress"
            placeholder="Current Address"
            value={formData.userLocation.currentAddress}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
          />

          {/* Role Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Your Role <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <input
                  type="radio"
                  name="userRole"
                  value={UserRole.STUDENT}
                  checked={formData.userRole === UserRole.STUDENT}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Student
                  </span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    I'm here to learn and complete assignments
                  </p>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <input
                  type="radio"
                  name="userRole"
                  value={UserRole.TEACHER}
                  checked={formData.userRole === UserRole.TEACHER}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Teacher
                  </span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    I want to create and manage courses
                  </p>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <input
                  type="radio"
                  name="userRole"
                  value={UserRole.ADMIN}
                  checked={formData.userRole === UserRole.ADMIN}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Admin
                  </span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    I need administrative access
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end space-y-3 space-y-reverse sm:space-y-0 sm:space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
            >
              Skip for now
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Completing...
                </>
              ) : (
                "Complete Profile"
              )}
            </button>
          </div>
        </form>

        {/* Google Account Info Display */}
        {state.user?.authProvider === "google" && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <div className="flex items-center space-x-3">
              {state.user.userProfileImage && (
                <img
                  src={state.user.userProfileImage}
                  alt={state.user.userName}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Signed in with Google
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  {state.user.userEmail}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialProfileCompletion;
