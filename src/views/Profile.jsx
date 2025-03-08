import { useEffect, useState } from "react";
import { useUser } from "../hooks/useUser";
import { fetchCalculations } from "../api/api";
import ProfileStyles from "../styles/Profile.styles";
import ProfileCard from "../components/profile/ProfileCard";
import AlertBanner from "../components/profile/AlertBanner";

const Profile = () => {
  const { user, userData, loading: userLoading, error: userError, updateUserData } = useUser();
  const [calculations, setCalculations] = useState([]);
  const [alertNeeded, setAlertNeeded] = useState(false);
  const [calculationsLoading, setCalculationsLoading] = useState(false);
  const [calculationsError, setCalculationsError] = useState("");

  // Only check eGFR calculations for patients
  useEffect(() => {
    if (!user.isAuthenticated || user.userType !== "patient") return;
    
    setCalculationsLoading(true);
    fetchCalculations("PatientID", user.userId, (data) => {
      setCalculations(data);

      if (data.length > 0) {
        const sorted = data.sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
        const mostRecent = new Date(sorted[0].CreatedAt);
        const now = new Date();
        const diffInDays = (now - mostRecent) / (1000 * 60 * 60 * 24);

        if (diffInDays > 90) {
          setAlertNeeded(true);
        }
      }
      setCalculationsLoading(false);
    }, setCalculationsLoading, setCalculationsError, "Failed to load calculations").catch((err) => {
      console.error("Error in checking eGFR calculations:", err);
      setCalculationsLoading(false);
    });
  }, [user.isAuthenticated, user.userId, user.userType]);

  // Handle userData updates
  const handleUserDataUpdate = (newData) => {
    updateUserData(newData);
  };

  // Show main loading state only when user data is loading
  if (userLoading) {
    return (
      <div style={ProfileStyles.container}>
        <h2 style={ProfileStyles.title}>Profile</h2>
        <p style={ProfileStyles.text}>Loading profile data...</p>
      </div>
    );
  }

  // Show error if user data failed to load
  if (userError) {
    return (
      <div style={ProfileStyles.container}>
        <h2 style={ProfileStyles.title}>Profile</h2>
        <p style={ProfileStyles.text}>{userError}</p>
      </div>
    );
  }

  return (
    <div style={ProfileStyles.container}>
      <h2 style={ProfileStyles.title}>
        {user.userType === "patient" ? "Patient Profile" : "Clinician Profile"}
      </h2>

      {/* Show alert banner only when calculations have loaded and alert is needed */}
      {user.userType === "patient" && !calculationsLoading && alertNeeded && (
        <AlertBanner message="Your most recent eGFR calculation is older than 3 months. Please check in." />
      )}
      
      {/* Show calculations error if any */}
      {calculationsError && (
        <p style={ProfileStyles.errorText}>{calculationsError}</p>
      )}

      {/* Always render the profile card once userData is available */}
      {userData && (
        <ProfileCard 
          userData={userData}
          userType={user.userType}
          userId={user.userId}
          updateUserData={handleUserDataUpdate}
          isCalculationsLoading={calculationsLoading}
        />
      )}
    </div>
  );
};

export default Profile;
