import React from "react"
import ReactDOM from "react-dom"

type PopoverContextType = {
  open: boolean
  setOpen: (v: boolean) => void
  triggerRef: React.RefObject<HTMLElement | null>
}
const PopoverContext = React.createContext<PopoverContextType | null>(null)

type PopoverProps = {
  children: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Popover({ children, open, defaultOpen, onOpenChange }: PopoverProps) {
  const uncontrolled = React.useRef(defaultOpen ?? false)
  const [stateOpen, setStateOpen] = React.useState<boolean>(uncontrolled.current)
  const isControlled = typeof open === "boolean"
  const currentOpen = isControlled ? (open as boolean) : stateOpen

  const triggerRef = React.useRef<HTMLElement | null>(null)

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setStateOpen(next)
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange]
  )

  return (
    <PopoverContext.Provider value={{ open: currentOpen, setOpen, triggerRef }}>
      {children}
    </PopoverContext.Provider>
  )
}

type TriggerProps = {
  children: React.ReactElement
  asChild?: boolean
  className?: string
}

function mergeRefs<T = any>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T) => {
    refs.forEach((ref) => {
      if (!ref) return
      if (typeof ref === "function") ref(node)
      else (ref as React.MutableRefObject<T | null>).current = node
    })
  }
}

export const PopoverTrigger: React.FC<TriggerProps> = ({ children, asChild }) => {
  const ctx = React.useContext(PopoverContext)
  if (!ctx) throw new Error("PopoverTrigger must be used within a Popover")

  const { open, setOpen, triggerRef } = ctx

  const child = React.Children.only(children) as React.ReactElement
  const childRef = (child as any).ref

  const onClick = (e: React.MouseEvent) => {
    const orig = (child.props && child.props.onClick) as ((e: React.MouseEvent) => void) | undefined
    orig?.(e)
    setOpen(!open)
  }

  const cloned = React.cloneElement(child, {
    ref: mergeRefs(triggerRef, childRef),
    onClick,
    "aria-expanded": open,
    "data-popover-trigger": true,
  })

  return asChild ? cloned : <span>{cloned}</span>
}

type ContentProps = {
  children: React.ReactNode
  className?: string
  align?: "start" | "center" | "end"
  alignOffset?: number
  sideOffset?: number
  style?: React.CSSProperties
  // pass-through for other attributes
  [key: string]: any
}

export const PopoverContent: React.FC<ContentProps> = ({
  children,
  className,
  align = "start",
  alignOffset = 0,
  sideOffset = 8,
  style,
  ...rest
}) => {
  const ctx = React.useContext(PopoverContext)
  if (!ctx) throw new Error("PopoverContent must be used within a Popover")

  const { open, setOpen, triggerRef } = ctx
  const contentRef = React.useRef<HTMLDivElement | null>(null)
  const [pos, setPos] = React.useState<{ top: number; left: number } | null>(null)

  // compute position whenever open changes
  React.useLayoutEffect(() => {
    if (!open) {
      setPos(null)
      return
    }
    const trigger = triggerRef.current
    const content = contentRef.current
    if (!trigger || !content) return

    const tRect = trigger.getBoundingClientRect()
    const cRect = content.getBoundingClientRect()
    // Default: place below trigger (sideOffset), align by 'align'
    const top = window.scrollY + tRect.bottom + sideOffset

    let left = window.scrollX + tRect.left
    if (align === "start") {
      // left stays
    } else if (align === "center") {
      left = window.scrollX + tRect.left + tRect.width / 2 - cRect.width / 2
    } else if (align === "end") {
      left = window.scrollX + tRect.right - cRect.width
    }
    // apply alignOffset
    left += alignOffset

    // ensure it stays in viewport horizontally
    const viewportWidth = document.documentElement.clientWidth
    const maxLeft = viewportWidth - cRect.width - 8
    if (left < 8) left = 8
    if (left > maxLeft) left = maxLeft

    setPos({ top, left })
  }, [open, align, alignOffset, sideOffset, triggerRef])

  // close on outside click and escape
  React.useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) {
      const t = e.target as Node
      if (!contentRef.current) return
      const insideContent = contentRef.current.contains(t)
      const insideTrigger = triggerRef.current?.contains(t)
      if (!insideContent && !insideTrigger) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open, setOpen, triggerRef])

  if (!open) return null

  const contentNode = (
    <div
      ref={contentRef}
      role="dialog"
      aria-modal="false"
      className={className}
      style={{
        position: "absolute",
        top: pos ? pos.top : undefined,
        left: pos ? pos.left : undefined,
        zIndex: 9999,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )

  return ReactDOM.createPortal(contentNode, document.body)
}
```// filepath: c:\Users\sarxx\OneDrive\Desktop\v\RESTRUCTURE-FRONTEND\src\components\ui\popover.tsx
import React from "react"
import ReactDOM from "react-dom"

type PopoverContextType = {
  open: boolean
  setOpen: (v: boolean) => void
  triggerRef: React.RefObject<HTMLElement | null>
}
const PopoverContext = React.createContext<PopoverContextType | null>(null)

type PopoverProps = {
  children: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Popover({ children, open, defaultOpen, onOpenChange }: PopoverProps) {
  const uncontrolled = React.useRef(defaultOpen ?? false)
  const [stateOpen, setStateOpen] = React.useState<boolean>(uncontrolled.current)
  const isControlled = typeof open === "boolean"
  const currentOpen = isControlled ? (open as boolean) : stateOpen

  const triggerRef = React.useRef<HTMLElement | null>(null)

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setStateOpen(next)
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange]
  )

  return (
    <PopoverContext.Provider value={{ open: currentOpen, setOpen, triggerRef }}>
      {children}
    </PopoverContext.Provider>
  )
}

type TriggerProps = {
  children: React.ReactElement
  asChild?: boolean
  className?: string
}

function mergeRefs<T = any>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T) => {
    refs.forEach((ref) => {
      if (!ref) return
      if (typeof ref === "function") ref(node)
      else (ref as React.MutableRefObject<T | null>).current = node
    })
  }
}

export const PopoverTrigger: React.FC<TriggerProps> = ({ children, asChild }) => {
  const ctx = React.useContext(PopoverContext)
  if (!ctx) throw new Error("PopoverTrigger must be used within a Popover")

  const { open, setOpen, triggerRef } = ctx

  const child = React.Children.only(children) as React.ReactElement
  const childRef = (child as any).ref

  const onClick = (e: React.MouseEvent) => {
    const orig = (child.props && child.props.onClick) as ((e: React.MouseEvent) => void) | undefined
    orig?.(e)
    setOpen(!open)
  }

  const cloned = React.cloneElement(child, {
    ref: mergeRefs(triggerRef, childRef),
    onClick,
    "aria-expanded": open,
    "data-popover-trigger": true,
  })

  return asChild ? cloned : <span>{cloned}</span>
}

type ContentProps = {
  children: React.ReactNode
  className?: string
  align?: "start" | "center" | "end"
  alignOffset?: number
  sideOffset?: number
  style?: React.CSSProperties
  // pass-through for other attributes
  [key: string]: any
}

export const PopoverContent: React.FC<ContentProps> = ({
  children,
  className,
  align = "start",
  alignOffset = 0,
  sideOffset = 8,
  style,
  ...rest
}) => {
  const ctx = React.useContext(PopoverContext)
  if (!ctx) throw new Error("PopoverContent must be used within a Popover")

  const { open, setOpen, triggerRef } = ctx
  const contentRef = React.useRef<HTMLDivElement | null>(null)
  const [pos, setPos] = React.useState<{ top: number; left: number } | null>(null)

  // compute position whenever open changes
  React.useLayoutEffect(() => {
    if (!open) {
      setPos(null)
      return
    }
    const trigger = triggerRef.current
    const content = contentRef.current
    if (!trigger || !content) return

    const tRect = trigger.getBoundingClientRect()
    const cRect = content.getBoundingClientRect()
    // Default: place below trigger (sideOffset), align by 'align'
    const top = window.scrollY + tRect.bottom + sideOffset

    let left = window.scrollX + tRect.left
    if (align === "start") {
      // left stays
    } else if (align === "center") {
      left = window.scrollX + tRect.left + tRect.width / 2 - cRect.width / 2
    } else if (align === "end") {
      left = window.scrollX + tRect.right - cRect.width
    }
    // apply alignOffset
    left += alignOffset

    // ensure it stays in viewport horizontally
    const viewportWidth = document.documentElement.clientWidth
    const maxLeft = viewportWidth - cRect.width - 8
    if (left < 8) left = 8
    if (left > maxLeft) left = maxLeft

    setPos({ top, left })
  }, [open, align, alignOffset, sideOffset, triggerRef])

  // close on outside click and escape
  React.useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) {
      const t = e.target as Node
      if (!contentRef.current) return
      const insideContent = contentRef.current.contains(t)
      const insideTrigger = triggerRef.current?.contains(t)
      if (!insideContent && !insideTrigger) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open, setOpen, triggerRef])

  if (!open) return null

  const contentNode = (
    <div
      ref={contentRef}
      role="dialog"
      aria-modal="false"
      className={className}
      style={{
        position: "absolute",
        top: pos ? pos.top : undefined,
        left: pos ? pos.left : undefined,
        zIndex: 9999,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )

  return ReactDOM.createPortal(contentNode, document.body)
}