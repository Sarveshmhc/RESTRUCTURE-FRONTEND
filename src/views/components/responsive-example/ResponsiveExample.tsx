import React from "react";
import { useDeviceType, useMobileView, DeviceType } from "../../../hooks/use-mobile";

/**
 * ResponsiveExample - Shows how to use enhanced mobile hooks
 * 
 * This component demonstrates various ways to use the enhanced
 * mobile detection utilities for different responsive behaviors.
 */
const ResponsiveExample: React.FC = () => {
    const deviceType = useDeviceType();
    const { isMobile, isTablet } = useMobileView();

    // Example 1: Different content based on device type
    const renderDeviceSpecificContent = () => {
        switch (deviceType) {
            case DeviceType.MOBILE:
                return (
                    <div style={{ padding: '0.5rem', fontSize: '0.9rem' }}>
                        <h3>Mobile View 📱</h3>
                        <p>Compact layout optimized for touch</p>
                        <button style={{ padding: '12px 16px', fontSize: '16px' }}>
                            Large Touch Button
                        </button>
                    </div>
                );

            case DeviceType.TABLET:
                return (
                    <div style={{ padding: '1rem', fontSize: '1rem' }}>
                        <h3>Tablet View 📋</h3>
                        <p>Balanced layout for medium screens</p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button style={{ padding: '10px 14px' }}>Action 1</button>
                            <button style={{ padding: '10px 14px' }}>Action 2</button>
                        </div>
                    </div>
                );

            case DeviceType.DESKTOP:
                return (
                    <div style={{ padding: '1.5rem', fontSize: '1rem' }}>
                        <h3>Desktop View 🖥️</h3>
                        <p>Full-featured layout with complete functionality</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                            <button style={{ padding: '8px 12px' }}>Action 1</button>
                            <button style={{ padding: '8px 12px' }}>Action 2</button>
                            <button style={{ padding: '8px 12px' }}>Action 3</button>
                        </div>
                    </div>
                );

            default:
                return <div>Unknown device type</div>;
        }
    };

    // Example 2: Conditional styling based on device
    const getContainerStyle = (): React.CSSProperties => {
        const baseStyle: React.CSSProperties = {
            border: '1px solid #ddd',
            borderRadius: '8px',
            margin: '1rem 0',
            backgroundColor: '#f9f9f9'
        };

        if (isMobile) {
            return {
                ...baseStyle,
                maxWidth: '100%',
                margin: '0.5rem 0'
            };
        } else if (isTablet) {
            return {
                ...baseStyle,
                maxWidth: '600px',
                margin: '1rem auto'
            };
        } else {
            return {
                ...baseStyle,
                maxWidth: '800px',
                margin: '1.5rem auto'
            };
        }
    };

    return (
        <div style={getContainerStyle()}>
            {renderDeviceSpecificContent()}

            {/* Example 3: Show/hide features based on device */}
            {!isMobile && (
                <div style={{ padding: '1rem', borderTop: '1px solid #ddd', backgroundColor: '#fff' }}>
                    <h4>Desktop/Tablet Only Features:</h4>
                    <ul>
                        <li>Advanced toolbar</li>
                        <li>Sidebar navigation</li>
                        <li>Keyboard shortcuts</li>
                    </ul>
                </div>
            )}

            {isMobile && (
                <div style={{ padding: '1rem', borderTop: '1px solid #ddd', backgroundColor: '#fff' }}>
                    <h4>Mobile Optimized Features:</h4>
                    <ul>
                        <li>Touch-friendly buttons</li>
                        <li>Swipe gestures</li>
                        <li>Pull-to-refresh</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ResponsiveExample;