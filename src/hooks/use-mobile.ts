import * as React from "react"

// Breakpoint constants
const MOBILE_BREAKPOINT = 800  // Increased from 768 to 800 for better mobile experience
const TABLET_BREAKPOINT = 1024

// Device type constants
export const DeviceType = {
  MOBILE: 'mobile',
  TABLET: 'tablet',
  DESKTOP: 'desktop'
} as const

export type DeviceType = typeof DeviceType[keyof typeof DeviceType]

// Hook for detecting mobile devices
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

// Hook for detecting tablet devices
export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT}px) and (max-width: ${TABLET_BREAKPOINT - 1}px)`)
    const onChange = () => {
      const width = window.innerWidth
      setIsTablet(width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    const width = window.innerWidth
    setIsTablet(width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isTablet
}

// Hook for getting current device type
export function useDeviceType(): DeviceType {
  const [deviceType, setDeviceType] = React.useState<DeviceType>(DeviceType.DESKTOP)

  React.useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth
      if (width < MOBILE_BREAKPOINT) {
        setDeviceType(DeviceType.MOBILE)
      } else if (width < TABLET_BREAKPOINT) {
        setDeviceType(DeviceType.TABLET)
      } else {
        setDeviceType(DeviceType.DESKTOP)
      }
    }

    const mql = window.matchMedia('(max-width: 1024px)')
    mql.addEventListener("change", updateDeviceType)
    updateDeviceType()
    return () => mql.removeEventListener("change", updateDeviceType)
  }, [])

  return deviceType
}

// Hook for responsive behavior management
export function useMobileView() {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const deviceType = useDeviceType()

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)

  // Auto-manage sidebar state based on device
  React.useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true)
      setMobileMenuOpen(false)
    }
  }, [isMobile])

  const toggleMobileMenu = React.useCallback(() => {
    const isNarrow = isMobile || window.innerWidth <= TABLET_BREAKPOINT
    if (isNarrow) {
      setMobileMenuOpen(prev => !prev)
    } else {
      setSidebarCollapsed(prev => !prev)
    }
  }, [isMobile])

  const closeMobileMenu = React.useCallback(() => {
    const isNarrow = isMobile || window.innerWidth <= TABLET_BREAKPOINT
    if (isNarrow) {
      setMobileMenuOpen(false)
    }
  }, [isMobile])

  return {
    isMobile,
    isTablet,
    deviceType,
    mobileMenuOpen,
    sidebarCollapsed,
    toggleMobileMenu,
    closeMobileMenu,
    setSidebarCollapsed,
    setMobileMenuOpen
  }
}
