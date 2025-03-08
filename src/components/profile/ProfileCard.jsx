import React from "react";
import { components } from "../../theme";
import ProfileField from "./ProfileField";
import ClinicianSelection from "./ClinicianSelection";

const ProfileCard = ({ userData, userType, userId, updateUserData }) => {
  return (
    <div style={styles.profileCard}>
      <ProfileField 
        label={userType === "patient" ? "Patient ID:" : "Clinician ID:"}
        value={userData?._id}
      />
      
      <ProfileField 
        label="First Name:"
        value={userData?.FirstName}
      />
      
      <ProfileField 
        label="Last Name:"
        value={userData?.LastName}
      />
      
      <ProfileField 
        label="Email:"
        value={userData?.Email}
      />
      
      <ProfileField 
        label="Phone Number:"
        value={userData?.PhoneNumber}
      />

      {/* Assigned Clinician Field - Only for Patients */}
      {userType === "patient" && (
        <ClinicianSelection 
          userId={userId}
          userData={userData}
          updateUserData={updateUserData}
        />
      )}
    </div>
  );
};

const styles = {
  profileCard: {
    ...components.card,
    width: "100%",
    maxWidth: "500px",
  }
};

export default ProfileCard;
