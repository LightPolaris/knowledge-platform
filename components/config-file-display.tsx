import React from 'react';
import { FileText, Settings } from 'lucide-react';

interface ConfigFileDisplayProps {
  fileName: string;
  content: any;
  description?: string;
}

export function ConfigFileDisplay({ fileName, content, description }: ConfigFileDisplayProps) {
  const formatJsonContent = (obj: any) => {
    return JSON.stringify(obj, null, 2);
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.json')) {
      return <FileText className="config-file-icon" />;
    }
    return <Settings className="config-file-icon" />;
  };

  return (
    <div className="config-file-container">
      <div className="config-file-header">
        {getFileIcon(fileName)}
        <div>
          <h3 className="config-file-title">{fileName}</h3>
          {description && (
            <p className="config-file-subtitle">{description}</p>
          )}
        </div>
      </div>
      <div className="config-content">
        <pre>{formatJsonContent(content)}</pre>
      </div>
    </div>
  );
}

export default ConfigFileDisplay;
