// components/UserPresenceToggle.tsx
import React, { useState } from "react";
import { updateUserPresence, logActivity } from "../services/api";
import { useTranslation } from "../hooks/useTranslation";

interface Props {
  userId: string; // ✅ רק string (MongoDB ObjectId)
  initialPresence: boolean;
}

const UserPresenceToggle: React.FC<Props> = ({ userId, initialPresence }) => {
  const [isPresent, setIsPresent] = useState(initialPresence);
  const { t } = useTranslation();

  console.log("🔍 UserPresenceToggle props:", { userId, initialPresence, userIdType: typeof userId });

  const togglePresence = async () => {
    try {
      console.log("🔄 Toggling presence from", isPresent, "to", !isPresent);
      const success = await updateUserPresence(userId, !isPresent);
      if (success) {
        setIsPresent(!isPresent);

        // ✅ Log presence change
        try {
          const currentUser = JSON.parse(localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser") || "{}");
          if (currentUser._id && currentUser.email && currentUser.poolId) {
            await logActivity(
              currentUser._id,
              currentUser.email,
              !isPresent ? t('presence.arrivedAtPool', 'הגעה לבריכה') : t('presence.leftPool', 'יציאה מהבריכה'),
              "presence",
              currentUser.poolId,
              `${!isPresent ? t('presence.userArrived', 'המשתמש הגיע') : t('presence.userLeft', 'המשתמש יצא')} מהבריכה`
            );
            console.log("✅ Activity logged: Presence changed");
          }
        } catch (logError) {
          console.error("❌ Error logging presence change:", logError);
        }
      }
    } catch (error) {
      console.error("❌ שגיאה בעדכון נוכחות", error);
    }
  };

  return (
    <button onClick={togglePresence}>
      {isPresent ? t('presence.inPool', '📍 אני בבריכה') : t('presence.notInPool', '🏠 איני בבריכה')}
    </button>
  );
};

export default UserPresenceToggle;
