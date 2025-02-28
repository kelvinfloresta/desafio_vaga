import React, { useState } from 'react';
import { transactionService } from '../services/transaction';

interface UploadResult {
  readonly success: boolean;
  readonly message: string;
  readonly processedCount?: number;
  readonly executionTime?: string;
}

interface FileUploadProps {
  onSuccess: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
      setResult(null);
    }
  };

  const handleUpload = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();

    if (!file) return;

    try {
      setIsLoading(true);
      setResult(null);

      const response = await transactionService.uploadFile(file);

      setResult({
        success: true,
        message: response.message,
        processedCount: response.data.processedCount,
        executionTime: response.data.executionTime,
      });

      onSuccess();
    } catch (error) {
      console.error('Error uploading file:', error);
      setResult({
        success: false,
        message: 'Error uploading file. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div onClick={() => inputRef.current?.click()} className="cursor-pointer mb-8 p-6 border-2 border-dashed border-gray-300 rounded-md text-center bg-gray-50 transition-all duration-300 hover:border-blue-400 hover:bg-blue-50">
      <label
        className="block cursor-pointer p-4 text-lg text-gray-700"
      >
        {file ? file.name : 'Select transaction file (.txt)'}
      </label>
      <input
        type="file"
        accept=".txt"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <div>
        <button
          onClick={handleUpload}
          disabled={!file || isLoading}
          className={`bg-blue-400 text-white border-none py-3 px-6 rounded text-base cursor-pointer transition-colors duration-300 mt-4 hover:bg-blue-400 ${
            isLoading ? 'bg-gray-300 cursor-not-allowed hover:bg-gray-300' : '' +
            file ? 'cursor-pointer bg-gray-300' : ''
          }`}
        >
          {isLoading ? 'Uploading...' : 'Upload File'}
        </button>
      </div>

      {result && (
        <div onClick={e => e.stopPropagation()} className="mt-6 p-4 rounded bg-blue-50">
          <h3 className="text-lg font-semibold">{result.success ? 'Success!' : 'Error'}</h3>
          <p className="my-2">{result.message}</p>
          {result.success && (
            <div className="text-sm">
              <p className="my-1">Processed: {result.processedCount} transactions</p>
              <p className="my-1">Execution time: {result.executionTime}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;