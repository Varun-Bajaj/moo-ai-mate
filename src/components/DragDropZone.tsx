import { useState, useRef } from "react";
import { Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DragDropZoneProps {
  onFileUpload: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

const DragDropZone = ({ onFileUpload, accept = ".csv", maxSize = 10, className = "" }: DragDropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }

    setIsUploading(true);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onFileUpload(file);
    setIsUploading(false);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`drag-zone rounded-2xl p-12 text-center transition-all duration-300 hover-scale cursor-pointer ${
          isDragging ? "drag-over" : ""
        } ${isUploading ? "animate-pulse" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="flex flex-col items-center space-y-4">
          {isUploading ? (
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <div className="relative">
              <Upload className={`w-16 h-16 text-primary transition-transform duration-300 ${isDragging ? "scale-110" : ""}`} />
              {isDragging && (
                <div className="absolute inset-0 w-16 h-16 bg-primary/20 rounded-full animate-ping"></div>
              )}
            </div>
          )}
          
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {isUploading ? "Uploading..." : "Drop your CSV file here"}
            </h3>
            <p className="text-muted-foreground">
              {isUploading ? "Processing your file..." : `or click to browse (max ${maxSize}MB)`}
            </p>
          </div>
          
          {!isUploading && (
            <Button 
              variant="outline" 
              className="glass hover-scale"
              onClick={handleButtonClick}
            >
              <FileText className="w-4 h-4 mr-2" />
              Choose File
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DragDropZone;