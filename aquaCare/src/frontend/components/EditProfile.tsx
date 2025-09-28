import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent,
  CircularProgress,
  Alert,
  Box,
  Avatar,
  Typography,
  CardContent,

  Divider,
  Paper,
} from "@mui/material";
import { PhotoCamera, Save, Cancel } from "@mui/icons-material";
import { User } from "../services/models/User";
import { getUserById, updateUser, logActivity } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../hooks/useTranslation";
import { saveUserToStorage } from "../utils/storageUtils";

// פונקציה לדחיסת תמונה
const compressImage = async (base64: string, quality: number = 0.5): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // קביעת גודל מקסימלי - הקטנת הגודל
      const maxSize = 400; // הקטנו מ-800 ל-400
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // ציור התמונה בגודל החדש
      ctx?.drawImage(img, 0, 0, width, height);
      
      // המרה ל-base64 עם דחיסה חזקה יותר
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      console.log("📊 Image compressed:", {
        originalSize: Math.round(base64.length / 1024),
        compressedSize: Math.round(compressedBase64.length / 1024),
        width,
        height,
        quality
      });
      resolve(compressedBase64);
    };
    img.src = base64;
  });
};

const EditProfile: React.FC = () => {
  const { user: contextUser, setUser: setContextUser } = useAuth();
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Get user ID from context or localStorage
        let userId: string | null = null;
        
        if (contextUser && contextUser._id) {
          userId = contextUser._id;
          console.log("🔍 Using user ID from context:", userId);
        } else {
          // Fallback to localStorage
          const stored = sessionStorage.getItem("currentUser") || localStorage.getItem("currentUser");
          if (stored) {
            const parsedUser = JSON.parse(stored);
            userId = parsedUser._id || parsedUser.id;
            console.log("🔍 Using user ID from localStorage:", userId);
          }
        }

        if (!userId) {
          console.error("❌ No user ID found");
          setError(t("error_cannot_identify_user"));
          setLoading(false);
          return;
        }

        // Check if userId is numeric (old format) and clear storage if needed
        if (typeof userId === 'number' || (typeof userId === 'string' && /^\d+$/.test(userId))) {
          console.log("🔄 User ID is numeric, clearing storage and redirecting to login...");
          localStorage.removeItem("currentUser");
          sessionStorage.removeItem("currentUser");
          localStorage.removeItem("rememberMe");
          navigate("/profile/login");
          return;
        }

        // Check if userId is a valid MongoDB ObjectId (24 character hex string)
        if (typeof userId !== 'string' || userId.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(userId)) {
          console.error("❌ User ID is not a valid MongoDB ObjectId:", userId);
          setError(t("error_invalid_user_id"));
          setLoading(false);
          return;
        }

        // Load user data from database
        console.log("📡 Loading user data from database...");
        const userData = await getUserById(userId);
        
        if (userData) {
          setUser(userData);
          console.log("✅ User data loaded from database:", userData);
        } else {
          setError(t("error_cannot_load_user_details"));
        }
      } catch (err) {
        console.error(t('profile.errorLoadingUserFromServer'), err);
        setError(t('profile.errorLoadingUserDetails'));
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [navigate, contextUser, t]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!user) return;
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSelectChange = (
    e: SelectChangeEvent
  ) => {
    if (!user) return;
    const { name, value } = e.target;
    if (name) setUser({ ...user, [name]: value });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    // אם לא נבחר קובץ, אפס את הבחירה
    if (!file) {
      setSelectedImage(null);
      setImagePreview(null);
      return;
    }

    // השתמש בפונקציה המשותפת
    processImageFile(file);
  };

  // פונקציות לגרירה ושחרור
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      // שימוש באותה לוגיקה של handleImageChange
      processImageFile(file);
    }
  };

  const processImageFile = (file: File) => {
    console.log("📁 Processing file:", {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    });

    // בדיקת סוג הקובץ
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
              setError(t("error_invalid_file_type"));
      console.error("❌ Invalid file type:", file.type);
      return;
    }
    
    // בדיקת גודל הקובץ (מקסימום 5MB - הקטנו)
    if (file.size > 5 * 1024 * 1024) {
              setError(t("error_image_size_too_large"));
      console.error("❌ File too large:", file.size, "bytes");
      return;
    }

    console.log("✅ File validation passed");
    setSelectedImage(file);
    
    // יצירת תצוגה מקדימה
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      console.log("✅ Image preview created, size:", result.length, "characters");
    };
    reader.onerror = (e) => {
      console.error("❌ Error reading file:", e);
              setError(t("error_reading_file"));
    };
    reader.readAsDataURL(file);
    
    setError(null);
    setSuccessMessage(null);
  };

  const getUserProfilePicture = (): string => {
    if (imagePreview) return imagePreview;
    if (user?.profilePicture) return user.profilePicture;
    
    // תמונות ברירת מחדל לפי מגדר
    if (user?.gender === "male") {
      return "/assets/avatar-male.svg";
    } else if (user?.gender === "female") {
      return "/assets/avatar-female.svg";
    }
    
    return "/assets/default-avatar.svg";
  };



  const handleSubmit = async () => {
    if (!user) return;
    
    setSuccessMessage(null);
    setError(null);
    
    console.log("🔍 handleSubmit called with user:", { userId: user._id, userType: typeof user._id, userLength: user._id?.length, user });
    
    // Validation
    if (!user._id) {
      console.error("❌ אין מזהה משתמש תקין:", user);
              setError(t("error_cannot_identify_user"));
      return;
    }
    
    if (!user.firstName?.trim()) {
      setError(t("error_first_name_required"));
      return;
    }
    
    if (!user.lastName?.trim()) {
      setError(t("error_last_name_required"));
      return;
    }
    
    if (!user.username?.trim()) {
      setError(t("error_username_required"));
      return;
    }
    
    // Username validation - only letters, numbers, and underscores
    if (!/^[a-zA-Z0-9_]+$/.test(user.username)) {
      setError(t("error_username_invalid_characters"));
      return;
    }
    
    // Phone validation (optional)
    if (user.phone && !/^[\d\-\s\+\(\)]+$/.test(user.phone)) {
      setError(t("error_invalid_phone_number"));
      return;
    }
    
    // Check if userId is a valid MongoDB ObjectId
    if (typeof user._id !== 'string' || user._id.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(user._id)) {
      console.error("❌ User ID is not a valid MongoDB ObjectId:", user._id);
      setError(t("error_invalid_user_id"));
      return;
    }
    
    try {
      setSaving(true);
      
      let profilePictureUrl = user.profilePicture;
      
      // העלאת תמונה אם נבחרה תמונה חדשה
      if (selectedImage) {
        console.log("📤 Processing new profile picture...", {
          fileName: selectedImage.name,
          fileSize: selectedImage.size,
          fileType: selectedImage.type
        });
        
        try {
          // שימוש בתצוגה המקדימה שכבר נוצרה
          if (imagePreview) {
            profilePictureUrl = imagePreview;
            console.log("✅ Using existing image preview, size:", Math.round(profilePictureUrl.length / 1024), "KB");
          } else {
            // אם אין תצוגה מקדימה, צור אותה עכשיו
            console.log("📸 Creating image preview...");
            const reader = new FileReader();
            const base64Promise = new Promise<string>((resolve, reject) => {
              reader.onload = () => {
                const result = reader.result as string;
                if (result && result.startsWith('data:image/')) {
                  resolve(result);
                } else {
                  reject(new Error('שגיאה בעיבוד התמונה'));
                }
              };
              reader.onerror = () => reject(new Error('שגיאה בקריאת הקובץ'));
              reader.readAsDataURL(selectedImage);
            });
            
            profilePictureUrl = await base64Promise;
            console.log("✅ Image converted to base64, size:", Math.round(profilePictureUrl.length / 1024), "KB");
          }
          
          // דחיסה אוטומטית של כל התמונות
          const originalSize = profilePictureUrl.length;
          console.log("📊 Original image size:", Math.round(originalSize / 1024), "KB");
          
          if (originalSize > 500 * 1024) { // אם התמונה גדולה מ-500KB
            console.log("⚠️ Image too large, compressing...");
            setSuccessMessage(t("processing_image"));
            
            // דחיסה חזקה יותר לתמונות גדולות
            const quality = originalSize > 1024 * 1024 ? 0.3 : 0.5; // דחיסה חזקה יותר לתמונות מעל 1MB
            profilePictureUrl = await compressImage(profilePictureUrl, quality);
            
            const compressedSize = profilePictureUrl.length;
            console.log("✅ Image compressed:", {
              original: Math.round(originalSize / 1024) + "KB",
              compressed: Math.round(compressedSize / 1024) + "KB",
              reduction: Math.round((1 - compressedSize / originalSize) * 100) + "%"
            });
            
            // אם עדיין גדולה מדי, דחס עוד יותר
            if (compressedSize > 500 * 1024) {
              console.log("⚠️ Still too large, compressing more...");
              setSuccessMessage(t("compressing_image_further"));
              profilePictureUrl = await compressImage(profilePictureUrl, 0.2);
              console.log("✅ Final compression:", Math.round(profilePictureUrl.length / 1024), "KB");
            }
          }
          
        } catch (conversionError: any) {
          console.error("❌ Error processing image:", conversionError);
          setError(conversionError.message || t("error_image_processing"));
          return;
        }
      }
      
      // בדיקה סופית של גודל התמונה לפני שליחה
      if (profilePictureUrl && profilePictureUrl.length > 1024 * 1024) { // אם התמונה עדיין גדולה מ-1MB
        console.log("⚠️ Image still too large for server, compressing one more time...");
        setSuccessMessage(t("final_compression"));
        profilePictureUrl = await compressImage(profilePictureUrl, 0.1); // דחיסה חזקה מאוד
        console.log("✅ Final server-safe size:", Math.round(profilePictureUrl.length / 1024), "KB");
      }

      // עדכון פרטי משתמש במסד הנתונים
              setSuccessMessage(t("sending_to_server"));
      console.log("📡 Sending update request to server...", {
        userId: user._id,
        updates: {
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          phone: user.phone,
          profilePicture: profilePictureUrl ? `${profilePictureUrl.substring(0, 50)}...` : null,
          language: user.language,
        },
        imageSize: profilePictureUrl ? Math.round(profilePictureUrl.length / 1024) + "KB" : "none"
      });

      const updatedUserData = await updateUser(user._id, {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        phone: user.phone,
        profilePicture: profilePictureUrl,
        language: user.language,
      });

      console.log("✅ User updated successfully:", {
        ...updatedUserData,
        profilePicture: updatedUserData.profilePicture ? `${updatedUserData.profilePicture.substring(0, 50)}...` : null
      });

      // עדכון המשתמש ב-context
      const finalUser = { ...user, ...updatedUserData };
      setContextUser(finalUser);
      
      // עדכון ה-localStorage/sessionStorage
      const rememberMe = localStorage.getItem("rememberMe") === "true";
      saveUserToStorage(finalUser, rememberMe);
      
      // רישום לוג פעילות
      try {
        await logActivity(
          user._id,
          user.email,
          "עדכון פרופיל אישי",
          "update",
          Number(user.poolId) || 1,
          "משתמש עדכן את הפרטים האישיים שלו"
        );
      } catch (logError) {
        console.error("❌ Error logging profile update:", logError);
      }
      
      const successMsg = selectedImage && profilePictureUrl
        ? `${t("profile_details_and_picture_updated")} (גודל: ${Math.round(profilePictureUrl.length / 1024)}KB)` 
        : `${t("profile_details_updated")}`;
      setSuccessMessage(successMsg);
      
      // איפוס הטופס
      setSelectedImage(null);
      setImagePreview(null);
      
      // חזרה לפרופיל אחרי 3 שניות
      setTimeout(() => {
        navigate("/profile/user-profile");
      }, 3000);
      
    } catch (err: any) {
      console.error("❌ שגיאה בעדכון המשתמש:", err);
      
      // טיפול בשגיאות ספציפיות
      if (err.response?.status === 413) {
        setError(t("error_image_too_large"));
        console.error("❌ Payload Too Large - Image size: too large for server");
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.error || t("error_invalid_data"));
      } else if (err.response?.status === 404) {
        setError(t("error_user_not_found"));
      } else if (err.response?.status === 500) {
        setError(t("error_server_error"));
      } else if (err.message?.includes("Network Error")) {
        setError(t("error_server_connection_problem"));
      } else {
        setError(t("error_updating_user"));
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="card p-4 max-w-md mx-auto text-center">
        <CircularProgress />
        <p className="mt-2">{t("loading_user_details")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-4 max-w-md mx-auto">
        <Alert severity="error" className="mb-3">
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate("/profile/user-profile")}>
          {t("back_to_profile")}
        </Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="card p-4 max-w-md mx-auto text-center">
        <p>{t("no_user_found")}</p>
        <Button variant="contained" onClick={() => navigate("/profile/login")}>
          {t("login_again")}
        </Button>
      </div>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ overflow: 'hidden' }}>
        {/* כותרת יפה */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', 
          color: 'white', 
          p: 3, 
          textAlign: 'center' 
        }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            {t("edit_personal_profile")}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
            {t("update_your_personal_details")}
          </Typography>
        </Box>

        <CardContent sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {successMessage}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
            {/* צד שמאל - תמונת פרופיל */}
            <Box sx={{ flex: { xs: '1', md: '0 0 33.333%' } }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  {t("profile_picture")}
                </Typography>
                
                <Box
                  sx={{
                    position: 'relative',
                    display: 'inline-block',
                    mb: 2,
                    p: 2,
                    border: '2px dashed',
                    borderColor: isDragOver ? 'primary.main' : 'grey.300',
                    borderRadius: 2,
                    backgroundColor: isDragOver ? 'primary.light' : 'transparent',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                  }}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('profile-picture-upload')?.click()}
                >
                  <Avatar
                    src={getUserProfilePicture()}
                    sx={{ 
                      width: 150, 
                      height: 150, 
                      mx: 'auto',
                      border: '4px solid',
                      borderColor: 'primary.main',
                      boxShadow: 3,
                      opacity: isDragOver ? 0.7 : 1,
                      transition: 'opacity 0.2s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        opacity: 0.8,
                      }
                    }}
                  />
                  
                  {isDragOver && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        borderRadius: 2,
                        color: 'white',
                      }}
                    >
                      <Typography variant="body2" fontWeight="bold">
                        {t("drop_here")}
                      </Typography>
                    </Box>
                  )}
                </Box>
                
                <input
                  accept="image/*"
                  hidden
                  id="profile-picture-upload"
                  type="file"
                  onChange={handleImageChange}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                  <label htmlFor="profile-picture-upload">
                    <Button
                      variant="contained"
                      component="span"
                      startIcon={<PhotoCamera />}
                      size="small"
                    >
                      {selectedImage ? (t("change_image")) : (t("add_image"))}
                    </Button>
                  </label>
                  
                  {selectedImage && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                        setError(null);
                        // איפוס שדה הקובץ
                        const fileInput = document.getElementById('profile-picture-upload') as HTMLInputElement;
                        if (fileInput) fileInput.value = '';
                      }}
                    >
                      הסר תמונה
                    </Button>
                  )}
                </Box>
                
                <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                  {t("max_5mb_jpg_png_gif_webp")}
                </Typography>
                
                <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.7rem' }}>
                  {t("drag_or_click_to_add_image")}
                </Typography>
                
                {selectedImage && (
                  <Typography variant="caption" display="block" color="primary.main" sx={{ mt: 0.5 }}>
                    {t("selected")}: {selectedImage.name} ({Math.round(selectedImage.size / 1024)} KB)
                  </Typography>
                )}
              </Box>
            </Box>

            {/* צד ימין - פרטים אישיים */}
            <Box sx={{ flex: { xs: '1', md: '0 0 66.667%' } }}>
              <Typography variant="h6" gutterBottom>
                {t("personal_details")}
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                  <TextField
                    label={t("first_name")}
                    name="firstName"
                    value={user.firstName || ""}
                    onChange={handleChange}
                    fullWidth
                    required
                    variant="outlined"
                  />
                  <TextField
                    label={t("last_name")}
                    name="lastName"
                    value={user.lastName || ""}
                    onChange={handleChange}
                    fullWidth
                    required
                    variant="outlined"
                  />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                  <TextField
                    label={t("username")}
                    name="username"
                    value={user.username || ""}
                    onChange={handleChange}
                    fullWidth
                    required
                    variant="outlined"
                    helperText={t("username_unique")}
                  />
                  <TextField
                    label={t("phone_number")}
                    name="phone"
                    value={user.phone || ""}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    helperText={t("example_phone_number")}
                  />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="language-label">{t("language")}</InputLabel>
                    <Select
                      labelId="language-label"
                      name="language"
                      value={user.language || "he"}
                      onChange={handleSelectChange}
                      label={t("language")}
                    >
                      <MenuItem value="he">{t("hebrew")}</MenuItem>
                      <MenuItem value="en">{t("english")}</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* כפתורים */}
          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                startIcon={<Cancel />}
                onClick={() => navigate("/profile/user-profile")}
                disabled={saving}
                sx={{ height: 48 }}
              >
                {t("cancel")}
              </Button>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save />}
                onClick={handleSubmit}
                disabled={saving}
                sx={{ height: 48 }}
              >
                {saving ? (t("saving_changes")) : (t("save_changes"))}
              </Button>
            </Box>

            <Button
              variant="text"
              color="secondary"
              fullWidth
              onClick={() => {
                if (window.confirm(t("clear_cache_and_reload"))) {
                  localStorage.clear();
                  sessionStorage.clear();
                  window.location.reload();
                }
              }}
              sx={{ mt: 2 }}
            >
              {t("clear_cache_and_reload")}
            </Button>
          </Box>
        </CardContent>
      </Paper>
    </Box>
  );
};

export default EditProfile;
