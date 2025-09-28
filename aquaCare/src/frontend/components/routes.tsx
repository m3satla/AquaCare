import React from "react";
import { Navigate } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Pages
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import SettingPage from "../pages/SettingPage";
import PaymentsPage from "../pages/PaymentsPage";
import BookingPage from "../pages/BookingPage";
import AppointmentsPage from "../pages/AppointmentsPage";
import DeveloperContact from "../pages/DeveloperContact";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsOfService from "../pages/TermsOfService";
import NotFound from "../pages/NotFound";
import ResetPasswordPage from "../pages/ResetPasswordPage";

// Admin Pages
import AdminDashboard from "./AdminDashboard";
import LockedUsersPage from "../pages/LockedUsersPage";
import ManagerRequestsPage from "../pages/ManagerRequestsPage";
import CustomerActivityLogPage from "../pages/CustomerActivityLogPage";
import StatisticsDashboardPage from "../pages/StatisticsDashboardPage";
import DailySummaryPage from "../pages/DailySummaryPage";
import OptimizationManagerPage from "../pages/OptimizationManagerPage";
import SensorStatusPage from "../pages/SensorStatusPage";
import PoolUsersPage from "../pages/PoolUsersPage";
import StatisticsPage from "../pages/StatisticsPage";
import FacilityPage from "../pages/FacilityPage";
import ReminderSenderPage from "../pages/ReminderSenderPage";
import AdminEmergencyManagerPage from "../pages/AdminEmergencyManagerPage";
import EmployeeDashboardPage from "../pages/EmployeeDashboardPage";
import FeedbackPage from "../pages/FeedbackPage";
import EditProfile from "./EditProfile";
import UserProfile from "./UserProfile";
import TherapistSchedulePage from "../pages/TherapistSchedulePage";
import InternalMessagesPage from "../pages/InternalMessagesPage";
import PersonalSensorsPage from "../pages/PersonalSensorsPage";
import UserPresencePage from "../pages/UserPresencePage";
import WorkSchedulePage from "../pages/WorkSchedulePage";

import InstructorSchedulePage from "../pages/InstructorSchedulePage";
import UserDetailsPage from "../pages/UserDetailspage";
import ProtectedEmployeePage from "../pages/ProtectedEmployeePage";

import GDPRConsentManagerPage from "../pages/GDPRConsentManagerPage";

// Layout בסיסי
import Layout from "./Layout";
import ActionHistoryPage from "../pages/ActionHistoryPage";



// קומפוננטות wrapper להרשאות
const RequireLogin: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user) {
    console.log("🔒 User not authenticated, redirecting to home");
    return <Navigate to="/home" replace />;
  }
  
  return children;
};

const RequireAdmin: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  console.log("🔍 RequireAdmin check - isAuthenticated:", isAuthenticated, "user:", user?.email, "role:", user?.role);
  
  if (!isAuthenticated || !user) {
    console.log("🔒 No user found, redirecting to home");
    return <Navigate to="/home" replace />;
  }
  
  console.log("🔍 Checking admin access for user:", user?.email, "Role:", user?.role);
  const isAdmin = user && user.role && (user.role.toLowerCase() === "admin" || user.role === "Admin");
  console.log("🔍 Is admin result:", isAdmin);
  if (!isAdmin) {
    console.log("❌ User is not admin, redirecting to home");
  } else {
    console.log("✅ User is admin, allowing access");
  }
  return isAdmin ? children : <Navigate to="/home" replace />;
};

const RequireEmployeeAccess: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user) {
    console.log("🔒 No user found, redirecting to home");
    return <Navigate to="/home" replace />;
  }
  
  console.log("🔍 Checking employee access for user:", user?.email, "Role:", user?.role);
  const isEmployee = user && user.role && (user.role.toLowerCase() === "admin" || user.role === "Admin" || user.role.toLowerCase() === "therapist");
  if (!isEmployee) {
    console.log("❌ User is not employee, redirecting to home");
  }
  return isEmployee ? children : <Navigate to="/home" replace />;
};

const RequireNormalUser: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user) {
    console.log("🔒 No user found, redirecting to home");
    return <Navigate to="/home" replace />;
  }
  
  console.log("🔍 Checking normal user access for user:", user?.email, "Role:", user?.role);
  const isNormalUser = user && user.role && user.role.toLowerCase() === "normal";
  if (!isNormalUser) {
    console.log("❌ User is not normal user, redirecting to home");
  }
  return isNormalUser ? children : <Navigate to="/home" replace />;
};

// קומפוננטות עטופות בדרישות הרשאה
const DashboardElement = () => (
  <RequireAdmin>
    <AdminDashboard />
  </RequireAdmin>
);



const PaymentsElement = () => (
  <RequireLogin>
    <RequireNormalUser>
      <PaymentsPage />
    </RequireNormalUser>
  </RequireLogin>
);

const ManagerRequestsElement = () => (
  <RequireAdmin>
    <ManagerRequestsPage />
  </RequireAdmin>
);

const UserProfileElement = () => <UserProfile />;

// כל המסלולים
export const routes = [
  { path: "/customeractivitylog", element: <RequireAdmin><CustomerActivityLogPage /></RequireAdmin> },
  { path: "/statisticsdashboard", element: <RequireAdmin><StatisticsDashboardPage /></RequireAdmin> },
  { path: "/dailysummary", element: <RequireAdmin><DailySummaryPage /></RequireAdmin> },
  { path: "/optimizationmanager", element: <RequireAdmin><OptimizationManagerPage /></RequireAdmin> },

  { path: "", element: <Navigate to="/home" replace />, title: "Home Redirect" },
  { path: "home", element: <HomePage />, title: "Home" },

  // Reset password routes - accessible without login
  { path: "reset-password", element: <ResetPasswordPage />, title: "Reset Password" },
  { path: "reset-password/:token", element: <ResetPasswordPage />, title: "Reset Password" },

  { path: "booking", element: <RequireLogin><BookingPage /></RequireLogin>, title: "Booking" },
  { path: "appointments", element: <RequireLogin><AppointmentsPage /></RequireLogin>, title: "הצגת תורים" },
  { path: "dashboard", element: <DashboardElement />, title: "Dashboard" },
  { path: "admin-locked-users", element: <RequireAdmin><LockedUsersPage /></RequireAdmin>, title: "Locked Users" },

  {
    path: "profile",
    element: <ProfilePage />,
    children: [
      { path: "", element: <Navigate to="login" replace /> },
      { path: "login", element: <LoginPage />, title: "Login" },
      { path: "register", element: <RegisterPage />, title: "Register" },
      { path: "user-profile", element: <UserProfileElement />, title: "User Profile" },
      { path: "edit", element: <EditProfile />, title: "Edit Profile" },
      { path: "reset-password", element: <ResetPasswordPage />, title: "Reset Password" },
  { path: "reset-password/:token", element: <ResetPasswordPage />, title: "Reset Password" },
    ]
  },

  { path: "manager-requests", element: <ManagerRequestsElement />, title: "Manager Requests" },

  { path: "sensor-status", element: <RequireAdmin><SensorStatusPage /></RequireAdmin>, title: "Sensor Status" },
  { path: "pool-users", element: <RequireAdmin><PoolUsersPage /></RequireAdmin>, title: "Pool Users" },
  { path: "StatisticsDashboard", element: <RequireAdmin><StatisticsPage /></RequireAdmin>, title: `דו"חות שימוש מפורטים` },
  { path: "facility-status", element: <RequireAdmin><FacilityPage /></RequireAdmin>, title: "סטטוס מתקנים" },

  { path: "settings", element: <SettingPage />, title: "Settings" },
  { path: "payments", element: <PaymentsElement />, title: "Payments" },

  { path: "privacy", element: <PrivacyPolicy />, title: "Privacy Policy" },
  { path: "terms", element: <TermsOfService />, title: "Terms of Service" },

  { path: "developer-contact", element: <DeveloperContact />, title: "Developer Contact" },

  { path: "activity-log", element: <RequireEmployeeAccess><CustomerActivityLogPage /></RequireEmployeeAccess>, title: "activityLog.activityLog" },

  { path: "reminder", element: <RequireAdmin><ReminderSenderPage /></RequireAdmin> },


  // ✅ מסלולים לאישור וביטול פגישה

  { path: "employee-dashboard", element: <RequireEmployeeAccess><EmployeeDashboardPage /></RequireEmployeeAccess>, title: "לוח בקרה עובדים" },
  { path: "therapist-schedule", element: <RequireEmployeeAccess><TherapistSchedulePage /></RequireEmployeeAccess>, title: "לוח זמנים מטפלים" },
  { path: "work-schedule", element: <RequireAdmin><WorkSchedulePage /></RequireAdmin>, title: "לוח עבודה" },
  { path: "internal-messages", element: <RequireEmployeeAccess><InternalMessagesPage /></RequireEmployeeAccess>, title: "הודעות פנימיות" },
{ path: "messages", element: <RequireLogin><InternalMessagesPage /></RequireLogin>, title: "הודעות" },
  { path: "personal-sensors", element: <RequireLogin><PersonalSensorsPage /></RequireLogin>, title: "חיישנים אישיים" },
  { path: "action-history", element: <RequireLogin><ActionHistoryPage /></RequireLogin>, title: "היסטוריית פעולות" },
  { path: "user-presence", element: <RequireLogin><UserPresencePage /></RequireLogin>, title: "נוכחות בבריכה" },

  { path: "instructor-schedule", element: <RequireLogin><InstructorSchedulePage /></RequireLogin>, title: "לוח זמנים מדריכים" },
  { path: "user-details", element: <RequireLogin><UserDetailsPage /></RequireLogin>, title: "פרטי משתמש" },
  { path: "developer-contact", element: <DeveloperContact />, title: "צור קשר עם המפתח" },
  { path: "locked-users", element: <RequireAdmin><LockedUsersPage /></RequireAdmin>, title: "משתמשים נעולים" },
  { path: "privacy-policy", element: <PrivacyPolicy />, title: "מדיניות פרטיות" },
  { path: "terms-of-service", element: <TermsOfService />, title: "תנאי שימוש" },
  { path: "statistics", element: <RequireLogin><StatisticsPage /></RequireLogin>, title: "סטטיסטיקות" },
  { path: "facility", element: <RequireLogin><FacilityPage /></RequireLogin>, title: "מצב מתקנים" },
  { path: "protected-employee", element: <RequireEmployeeAccess><ProtectedEmployeePage /></RequireEmployeeAccess>, title: "אזור עובדים מוגן" },
  { path: "manager-requests", element: <RequireAdmin><ManagerRequestsPage /></RequireAdmin>, title: "בקשות מנהלים" },


  { path: "gdpr-consent", element: <RequireLogin><GDPRConsentManagerPage /></RequireLogin>, title: "ניהול הסכמות GDPR" },
  { path: "admin-emergency-manager", element: <RequireAdmin><AdminEmergencyManagerPage /></RequireAdmin>, title: "ניהול מצבי חירום - מנהל" },
  { path: "feedback", element: <FeedbackPage />, title: "משוב לקוח" },

  { path: "*", element: <NotFound />, title: "404 Not Found" },
];

// יצירת ה-router
export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: routes,
  },
]);
