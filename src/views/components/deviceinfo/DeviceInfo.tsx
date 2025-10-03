import React from "react";
import { useDeviceType, useIsMobile, useIsTablet, DeviceType } from "../../../hooks/use-mobile";
import styles from "./deviceinfo.module.css";

interface DeviceInfoProps {
    showDebugInfo?: boolean;
}

/**
 * DeviceInfo Component - Demonstrates usage of enhanced mobile hooks
 * 
 * This component shows how to use the various device detection utilities
 * from the enhanced use-mobile.ts hook system.
 */
const DeviceInfo: React.FC<DeviceInfoProps> = ({ showDebugInfo = false }) => {
    const isMobile = useIsMobile();
    const isTablet = useIsTablet();
    const deviceType = useDeviceType();

    // Example of conditional rendering based on device type
    const getDeviceSpecificContent = () => {
        switch (deviceType) {
            case DeviceType.MOBILE:
                return {
                    message: "Mobile-optimized view",
                    icon: "📱",
                    description: "Optimized for touch interactions and small screens"
                };
            case DeviceType.TABLET:
                return {
                    message: "Tablet-optimized view",
                    icon: "📋",
                    description: "Balanced layout for medium-sized screens"
                };
            case DeviceType.DESKTOP:
                return {
                    message: "Desktop full-featured view",
                    icon: "🖥️",
                    description: "Complete feature set with full navigation"
                };
            default:
                return {
                    message: "Unknown device",
                    icon: "❓",
                    description: "Device type not detected"
                };
        }
    };

    const content = getDeviceSpecificContent();

    // Example of responsive component behavior
    const getLayoutClasses = () => {
        const baseClass = styles.deviceInfo;

        if (isMobile) {
            return `${baseClass} ${styles.mobileLayout}`;
        } else if (isTablet) {
            return `${baseClass} ${styles.tabletLayout}`;
        } else {
            return `${baseClass} ${styles.desktopLayout}`;
        }
    };

    if (!showDebugInfo) {
        return null;
    }

    return (
        <div className={getLayoutClasses()}>
            <div className={styles.deviceDisplay}>
                <span className={styles.deviceIcon}>{content.icon}</span>
                <div className={styles.deviceDetails}>
                    <h3 className={styles.deviceTitle}>{content.message}</h3>
                    <p className={styles.deviceDescription}>{content.description}</p>
                </div>
            </div>

            <div className={styles.debugInfo}>
                <h4>Device Detection Debug Info:</h4>
                <ul>
                    <li>Device Type: <strong>{deviceType}</strong></li>
                    <li>Is Mobile: <strong>{isMobile ? 'Yes' : 'No'}</strong></li>
                    <li>Is Tablet: <strong>{isTablet ? 'Yes' : 'No'}</strong></li>
                    <li>Window Width: <strong>{typeof window !== 'undefined' ? window.innerWidth : 'N/A'}px</strong></li>
                </ul>
            </div>
        </div>
    );
};

export default DeviceInfo;