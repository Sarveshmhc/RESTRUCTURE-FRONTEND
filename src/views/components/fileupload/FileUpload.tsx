import React from "react"
import styles from "./fileupload.module.css"

type FileItem = {
  id: string
  file: File
  preview?: string
  progress: number
  status: "ready" | "uploading" | "done" | "error"
  controller?: AbortController
}

export type FileUploadProps = {
  accept?: string
  multiple?: boolean
  maxFiles?: number
  onChange?: (files: File[]) => void
  uploadHandler?: (file: File, onProgress: (p: number) => void, signal?: AbortSignal) => Promise<any>
}

/**
 * Simple FileUpload component with drag/drop, preview, progress and removal.
 * If uploadHandler is not provided the component simulates upload progress.
 */
const FileUpload: React.FC<FileUploadProps> = ({
  accept = "image/*,application/pdf",
  multiple = true,
  maxFiles = 10,
  onChange,
  uploadHandler,
}) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const [items, setItems] = React.useState<FileItem[]>([])
  const [drag, setDrag] = React.useState(false)

  React.useEffect(() => {
    return () => {
      // revoke object URLs
      items.forEach((it) => it.preview && URL.revokeObjectURL(it.preview))
    }
  }, [items])

  const emitChange = (next: FileItem[]) => {
    onChange?.(next.map((i) => i.file))
  }

  const addFiles = (files: FileList | null) => {
    if (!files) return
    const arr = Array.from(files)
    if (arr.length === 0) return
    setItems((prev) => {
      const allowed = prev.length + arr.length <= maxFiles ? arr : arr.slice(0, Math.max(0, maxFiles - prev.length))
      const newItems = allowed.map((f) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        file: f,
        preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
        progress: 0,
        status: "ready" as const,
      }))
      const next = [...prev, ...newItems]
      emitChange(next)
      // auto-start uploads
      newItems.forEach((it) => startUpload(it))
      return next
    })
  }

  const startUpload = React.useCallback(
    (item: FileItem) => {
      setItems((prev) => prev.map((p) => (p.id === item.id ? { ...p, status: "uploading", progress: 6 } : p)))
      const controller = new AbortController()
      const onProgress = (p: number) => {
        setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, progress: Math.max(0, Math.min(100, p)) } : x)))
      }

      const doSimulated = () =>
        new Promise<void>((resolve) => {
          let p = 6
          const t = setInterval(() => {
            p += Math.random() * 18
            onProgress(Math.min(100, Math.round(p)))
            if (p >= 100) {
              clearInterval(t)
              resolve()
            }
          }, 380)
        })

      const runner = uploadHandler
        ? uploadHandler(item.file, onProgress, controller.signal)
        : doSimulated()

      runner
        .then(() => {
          setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, progress: 100, status: "done" } : x)))
          emitChange(items.concat()) // best-effort notify
        })
        .catch((err) => {
          if ((err && (err.name === "AbortError" || err === "aborted"))) {
            setItems((prev) => prev.filter((x) => x.id !== item.id))
            return
          }
          setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, status: "error" } : x)))
        })

      // attach controller for cancellation
      setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, controller } : x)))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [uploadHandler]
  )

  const onRemove = (id: string) => {
    setItems((prev) => {
      const found = prev.find((p) => p.id === id)
      if (found?.controller) found.controller.abort()
      const next = prev.filter((p) => p.id !== id)
      emitChange(next)
      if (found?.preview) URL.revokeObjectURL(found.preview)
      return next
    })
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDrag(false)
    addFiles(e.dataTransfer.files)
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDrag(true)
  }

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDrag(false)
  }

  return (
    <div className={styles.container}>
      <div
        role="button"
        tabIndex={0}
        className={`${styles.dropzone} ${drag ? styles.dragover : ""}`}
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragEnter={onDragOver}
        onDragLeave={onDragLeave}
      >
        <div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 3v10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 15v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 3l4 4M12 3l-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="hint" style={{ display: "inline-block" }}>
              <div style={{ fontWeight: 700 }}>Drag & drop files here</div>
              <div className="hint" style={{ fontSize: 13, color: "var(--muted)" }}>or click to select (images, pdf)</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.controls}>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          style={{ display: "none" }}
          onChange={(e) => addFiles(e.target.files)}
        />
        <button type="button" className={`${styles.btn} ${styles.ghost}`} onClick={() => inputRef.current?.click()}>
          Choose files
        </button>
        <button
          type="button"
          className={styles.btn}
          onClick={() => {
            // start any files that are 'ready'
            items.filter((it) => it.status === "ready").forEach((it) => startUpload(it))
          }}
          disabled={items.filter((it) => it.status === "ready").length === 0}
        >
          Upload all
        </button>
      </div>

      <div className={styles.list}>
        {items.map((it) => (
          <div key={it.id} className={styles.item}>
            <div className={styles.thumb}>
              {it.preview ? <img src={it.preview} alt={it.file.name} /> : <svg width="32" height="24" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M3 7v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 11l2 2 3-3 5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>

            <div className={styles.meta}>
              <div className={styles.name}>{it.file.name}</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ width: "100%" }}>
                  <div className={styles.progress}><i style={{ width: `${it.progress}%` }} /></div>
                </div>
                <div className={styles.size}>{(it.file.size / 1024).toFixed(0)} KB</div>
              </div>
            </div>

            <div className={styles.actions}>
              <div className={styles.status}>
                {it.status === "uploading" ? "Uploading…" : it.status === "done" ? "Uploaded" : it.status === "error" ? "Error" : "Ready"}
              </div>
              <button type="button" className={styles.remove} onClick={() => onRemove(it.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FileUpload
