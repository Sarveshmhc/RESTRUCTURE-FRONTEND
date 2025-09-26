import React from "react";
type FileUploadProps = {
  onChange: (files: FileList | null) => void;
  accept?: string;
  multiple?: boolean;
};
const FileUpload: React.FC<FileUploadProps> = ({ onChange, accept, multiple }) => (
  <label className="block">
    <input
      type="file"
      className="hidden"
      accept={accept}
      multiple={multiple}
      onChange={(e) => onChange(e.target.files)}
    />
    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer">
      <span className="text-gray-600 dark:text-gray-400">Click or drag to upload</span>
    </div>
  </label>
);
export default FileUpload;