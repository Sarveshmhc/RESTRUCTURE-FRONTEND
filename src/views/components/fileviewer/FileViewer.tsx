import React, { useEffect, useMemo, useState } from "react";
import styles from "./fileviewer.module.css";

type FileLike =
  | { id?: string; name: string; url?: string; file?: File; mime?: string; size?: number; uploadedAt?: string }
  | File;

type FileViewerProps = {
  files: FileLike[];
  initialIndex?: number;
  onClose?: () => void;
  onRemove?: (index: number) => void;
  allowDownload?: boolean;
};

const fmtSize = (n?: number) => {
  if (!n) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
};

const getName = (f: FileLike) => {
  if (f instanceof File) return f.name;
  if ("name" in f) return f.name;
  return "file";
};
const getUrl = (f: FileLike) => {
  if (f instanceof File) return URL.createObjectURL(f);
  if ("file" in f && f.file) return URL.createObjectURL(f.file);
  return "url" in f ? f.url : undefined;
};
const getMime = (f: FileLike) => {
  if (f instanceof File) return f.type;
  if ("file" in f && f.file) return f.file.type;
  return "mime" in f ? f.mime : undefined;
};
const getSize = (f: FileLike) => {
  if (f instanceof File) return f.size;
  if ("file" in f && f.file) return f.file.size;
  return "size" in f ? f.size : undefined;
};

const isImage = (mime?: string) => !!mime && mime.startsWith("image/");
const isPdf = (mime?: string, name?: string) => (mime && mime === "application/pdf") || (name && name.toLowerCase().endsWith(".pdf"));
const isText = (mime?: string, name?: string) =>
  (mime && mime.startsWith("text/")) || (name && /\.(txt|csv|json|md|log)$/i.test(name));

const FileViewer: React.FC<FileViewerProps> = ({ files, initialIndex = 0, onClose, onRemove, allowDownload = true }) => {
  const safeFiles = useMemo(() => files.slice(), [files]);
  const [index, setIndex] = useState(() => Math.max(0, Math.min(initialIndex, safeFiles.length - 1)));
  const [textPreview, setTextPreview] = useState<string | null>(null);

  useEffect(() => {
    setIndex((i) => Math.max(0, Math.min(i, safeFiles.length - 1)));
  }, [safeFiles.length]);

  useEffect(() => {
    // load text preview when needed
    const cur = safeFiles[index];
    const mime = getMime(cur);
    const name = getName(cur);
    if (isText(mime, name)) {
      (async () => {
        try {
          const url = getUrl(cur);
          if (!url) { setTextPreview(null); return; }
          const res = await fetch(url);
          const txt = await res.text();
          setTextPreview(txt.slice(0, 20000)); // cap
        } catch {
          setTextPreview("Unable to load preview.");
        }
      })();
    } else {
      setTextPreview(null);
    }
    // cleanup blob URLs created from File objects when component unmounts is not strictly necessary here
  }, [index, safeFiles]);

  if (safeFiles.length === 0) return null;

  const cur = safeFiles[index];
  const name = getName(cur);
  const url = getUrl(cur);
  const mime = getMime(cur);
  const size = getSize(cur);
  const uploadedAt = "uploadedAt" in (cur as any) ? (cur as any).uploadedAt : undefined;

  const downloadHref = url;

  const goPrev = () => setIndex((i) => Math.max(0, i - 1));
  const goNext = () => setIndex((i) => Math.min(safeFiles.length - 1, i + 1));

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-label="File viewer">
      <div className={styles.panel}>
        <div className={styles.toolbar}>
          <div className={styles.left}>
            <button className={styles.iconBtn} onClick={() => setIndex(0)} title="First" disabled={index === 0}>⏮</button>
            <button className={styles.iconBtn} onClick={goPrev} title="Previous" disabled={index === 0}>◀</button>
            <div className={styles.title}>
              <div className={styles.filename}>{name}</div>
              <div className={styles.meta}>
                {fmtSize(size)} {uploadedAt ? `• ${uploadedAt}` : null}
              </div>
            </div>
          </div>

          <div className={styles.right}>
            {allowDownload && downloadHref && (
              <a className={styles.action} href={downloadHref} download={name} target="_blank" rel="noreferrer" title="Download">
                ⬇
              </a>
            )}
            <button
              className={styles.action}
              onClick={() => {
                if (downloadHref) window.open(downloadHref, "_blank");
              }}
              title="Open in new tab"
            >
              ↗
            </button>

            {typeof onRemove === "function" && (
              <button
                className={styles.actionDanger}
                onClick={() => {
                  onRemove(index);
                }}
                title="Remove file"
              >
                🗑
              </button>
            )}

            <button className={styles.iconBtn} onClick={onClose} title="Close">✕</button>
          </div>
        </div>

        <div className={styles.content}>
          {/* preview area */}
          <div className={styles.preview}>
            {isImage(mime) && url && (
              <img src={url} alt={name} className={styles.imagePreview} />
            )}

            {isPdf(mime, name) && url && (
              <object data={url} type="application/pdf" className={styles.pdfPreview}>
                <iframe src={url} title={name} className={styles.pdfPreview} />
              </object>
            )}

            {isText(mime, name) && textPreview !== null && (
              <pre className={styles.textPreview}>{textPreview}</pre>
            )}

            {!isImage(mime) && !isPdf(mime, name) && !isText(mime, name) && (
              <div className={styles.unknown}>
                <div className={styles.unknownIcon}>📄</div>
                <div className={styles.unknownText}>No preview available</div>
                {downloadHref && (
                  <a className={styles.actionLink} href={downloadHref} download={name} target="_blank" rel="noreferrer">Download to view</a>
                )}
              </div>
            )}
          </div>

          {/* sidebar thumbnails / list */}
          <div className={styles.side}>
            <div className={styles.sideHeader}>Files</div>
            <div className={styles.thumbList}>
              {safeFiles.map((f, i) => {
                const n = getName(f);
                const u = getUrl(f);
                const m = getMime(f);
                const s = getSize(f);
                return (
                  <button
                    key={i}
                    className={`${styles.thumb} ${i === index ? styles.thumbActive : ""}`}
                    onClick={() => setIndex(i)}
                    title={n}
                  >
                    {isImage(m) && u ? (
                      <img src={u} alt={n} className={styles.thumbImg} />
                    ) : (
                      <div className={styles.thumbIcon}>📄</div>
                    )}
                    <div className={styles.thumbInfo}>
                      <div className={styles.thumbName}>{n}</div>
                      <div className={styles.thumbMeta}>{fmtSize(s)}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.pagination}>
            <button className={styles.pill} onClick={goPrev} disabled={index === 0}>Previous</button>
            <span className={styles.pageCount}>{index + 1} / {safeFiles.length}</span>
            <button className={styles.pill} onClick={goNext} disabled={index === safeFiles.length - 1}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileViewer;