import React from 'react';
import { FileUploadFieldProps } from './interfaces/interfaces';

const FileUploadField: React.FC<FileUploadFieldProps> = ({ label, name, onChange }) => {
  return (
    <div>
      <p>{label}</p>
      <input type="file" name={name} onChange={onChange} />
    </div>
  );
};

export default FileUploadField;
