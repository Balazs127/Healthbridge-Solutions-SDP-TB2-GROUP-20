import { useEffect, useState } from "react";
import { useUser } from "../hooks/useUser";
import { fetchUserData, fetchCalculations } from "../api/api";
import ProfileStyles from "../styles/Profile.styles";
import ProfileCard from "../components/profile/ProfileCard";
import AlertBanner from "../components/profile/AlertBanner";

const Profile = () => {
  const { user } = useUser();
  const [userData, setUserData] = useState(null);
  const [calculations, setCalculations] = useState([]);
  const [alertNeeded, setAlertNeeded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user data based on user type
  useEffect(() => {
    if (!user.isAuthenticated) return;
    
    fetchUserData(user, setUserData, setLoading, setError);
  }, [user.isAuthenticated, user.userId, user.userType]);

  // Only check eGFR calculations for patients
  useEffect(() => {
    if (!user.isAuthenticated || user.userType !== "patient") return;

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
    }).catch((err) => {
      console.error("Error in checking eGFR calculations:", err);
    });
  }, [user.isAuthenticated, user.userId, user.userType]);

  // Update userData when changes are made
  const updateUserData = (newData) => {
    setUserData(newData);
  };

  if (loading) {
    return (
      <div style={ProfileStyles.container}>
        <h2 style={ProfileStyles.title}>Profile</h2>
        <p style={ProfileStyles.text}>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={ProfileStyles.container}>
        <h2 style={ProfileStyles.title}>Profile</h2>
        <p style={ProfileStyles.text}>{error}</p>
      </div>
    );
  }

  return (
    <div style={ProfileStyles.container}>
      <h2 style={ProfileStyles.title}>
        {user.userType === "patient" ? "Patient Profile" : "Clinician Profile"}
      </h2>

      {/* Alert for patients with old eGFR calculation */}
      {user.userType === "patient" && alertNeeded && (
        <AlertBanner message="Your most recent eGFR calculation is older than 3 months. Please check in." />
      )}

      <ProfileCard 
        userData={userData}
        userType={user.userType}
        userId={user.userId}
        updateUserData={updateUserData}
      />
    </div>
  );
};

export default Profile;
