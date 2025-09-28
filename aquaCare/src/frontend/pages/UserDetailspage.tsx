import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserByEmail } from "../services/api";
import UserProfile from "../components/UserProfile";
import { User } from "../services/models/User";
import { useTranslation } from "../hooks/useTranslation";

const UserDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);

      const currentUser = sessionStorage.getItem("currentUser");
      if (!currentUser) {
        alert(t('userDetails.noUserLoggedIn'));
        navigate("/profile/login");
        return;
      }

      try {
        const userData = JSON.parse(currentUser);
        if (!userData?.email) throw new Error(t('userDetails.userEmailMissing'));

        // שליפת המשתמש מהשרת
        const user = await getUserByEmail(userData.email);
        if (!user) throw new Error(t('userDetails.userNotFound'));

        setUserDetails(user);
      } catch (error) {
        console.error(t('userDetails.errorLoadingUser'), error);
        alert(t('userDetails.errorIdentifyingUser'));
        navigate("/profile/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, t]);

  const logout = () => {
    sessionStorage.removeItem("currentUser");
    console.log(t('userDetails.userLoggedOut'));
    navigate("/home");
  };

  return (
    <div className="container">
      {loading ? (
        <p className="text-center text-info">{t('userDetails.loadingData')}</p>
      ) : userDetails ? (
        <UserProfile user={userDetails} onLogout={logout} />
      ) : (
        <p className="text-center text-danger">{t('userDetails.noUserDataFound')}</p>
      )}
    </div>
  );
};

export default UserDetailsPage;
