import React from "react";
import styles from "./profile.module.css";
import { LogOut, User } from "lucide-react";

const Profile: React.FC = () => {
  // Replace with your auth/user context/store
  const user = { name: "Jane Doe", email: "jane@company.com", avatar: "" };

  const handleLogout = () => {
    // Add your logout logic here
    alert("Logged out!");
  };

  return (
    <div className={styles.profile}>
      <div className={styles.avatar}>
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} />
        ) : (
          <User size={28} />
        )}
      </div>
      <div className={styles.info}>
        <div className={styles.name}>{user.name}</div>
        <div className={styles.email}>{user.email}</div>
      </div>
      <button className={styles.logout} onClick={handleLogout} title="Logout">
        <LogOut size={20} />
      </button>
    </div>
  );
};

export default Profile;