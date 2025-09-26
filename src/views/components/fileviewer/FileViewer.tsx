import React from "react";
type FileViewerProps = { url: string; type?: string };
const FileViewer: React.FC<FileViewerProps> = ({ url, type }) => {
  if (type === "pdf")
    return (
      <iframe
        src={url}
        title="PDF Viewer"
        className="w-full h-96 border rounded"
      />
    );
  if (type?.startsWith("image"))
    return <img src={url} alt="File" className="w-full h-auto rounded" />;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
      Download File
    </a>
  );
};
export default FileViewer;