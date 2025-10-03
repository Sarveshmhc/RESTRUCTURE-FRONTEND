import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './hrhomepage.module.css';
import Avatar from '../../components/avatar/Avatar';
import ProgressBar from '../../components/progress-bar/ProgressBar';

const HRHomepage: React.FC = () => {
    const { user } = useAuth();

    const currentDate = new Date();
    const dateString = currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const timeString = currentDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className={styles.homepage}>
            {/* Welcome Section - Matching Screenshot Exactly */}
            <div className={styles.welcomeSection}>
                <div className={styles.welcomeCard}>
                    <div className={styles.profileArea}>
                        <Avatar
                            src={user?.profilePicture || ''}
                            alt={user?.name || 'HR Manager'}
                            size={80}
                        />
                        <div className={styles.welcomeText}>
                            <h1 className={styles.welcomeTitle}>Welcome</h1>
                            <p className={styles.welcomeSubtitle}>Hope you are having a great day.</p>
                        </div>
                        <div className={styles.dateTimeArea}>
                            <div className={styles.dateInfo}>
                                <span className={styles.dayDate}>{dateString}</span>
                                <span className={styles.lastPunch}>Last punch: {timeString}</span>
                            </div>
                        </div>
                    </div>

                    {/* Profile Completion - Matching Screenshot */}
                    <div className={styles.profileCompletion}>
                        <div className={styles.completionHeader}>
                            <span className={styles.completionTitle}>Profile Completion</span>
                            <span className={styles.completionPercentage}>60%</span>
                        </div>
                        <div className={styles.progressContainer}>
                            <ProgressBar value={60} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HRHomepage;