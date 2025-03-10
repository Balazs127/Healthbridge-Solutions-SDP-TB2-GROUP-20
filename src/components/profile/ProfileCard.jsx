import { components } from "../../theme";
import ProfileField from "./ProfileField";
import ClinicianSelection from "./ClinicianSelection";
import PropTypes from "prop-types";

const ProfileCard = ({ userData, userType, userId, updateUserData }) => {
  // View --------------------------------------------------------------------
  return (
    <div style={styles.profileCard}>
      <ProfileField label="First Name:" value={userData?.FirstName} />

      <ProfileField label="Last Name:" value={userData?.LastName} />

      <ProfileField label="Email:" value={userData?.Email} />

      <ProfileField label="Phone Number:" value={userData?.PhoneNumber} />

      {/* Assigned Clinician Field - Only for Patients */}
      {userType === "patient" && (
        <ClinicianSelection userId={userId} userData={userData} updateUserData={updateUserData} />
      )}
    </div>
  );
};

const styles = {
  profileCard: {
    ...components.card,
    width: "100%",
    maxWidth: "500px",
  },
};

ProfileCard.propTypes = {
  userData: PropTypes.object.isRequired,
  userType: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  updateUserData: PropTypes.func.isRequired,
};

export default ProfileCard;
