import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Loader, User, Trash2 } from 'lucide-react';
import { avatarService } from '../services/avatarService';

interface AvatarUploadProps {
  currentAvatar?: string;
  userName: string;
  userId: string;
  onAvatarChange: (newAvatarUrl: string | null) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  editable?: boolean;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  userName,
  userId,
  onAvatarChange,
  size = 'md',
  className = '',
  editable = true
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    setError('');
    setIsUploading(true);

    try {
      // Resize image before upload
      const resizedFile = await avatarService.resizeImage(file);
      
      // Upload avatar
      const result = await avatarService.uploadAvatar(resizedFile, userId);

      if (result.success && result.avatarUrl) {
        onAvatarChange(result.avatarUrl);
      } else {
        setError(result.error || 'Upload failed');
      }
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDeleteAvatar = async () => {
    setIsUploading(true);
    try {
      const result = await avatarService.deleteAvatar(userId);
      if (result.success) {
        onAvatarChange(null);
        setShowDeleteConfirm(false);
      } else {
        setError(result.error || 'Delete failed');
      }
    } catch (err: any) {
      setError(err.message || 'Delete failed');
    } finally {
      setIsUploading(false);
    }
  };

  const avatarUrl = currentAvatar || avatarService.generateInitialsAvatar(userName);

  return (
    <div className={`relative ${className}`}>
      <div
        className={`relative ${sizeClasses[size]} rounded-full overflow-hidden group ${
          editable ? 'cursor-pointer' : ''
        } ${
          dragActive ? 'ring-4 ring-blue-500 ring-opacity-50' : ''
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => editable && fileInputRef.current?.click()}
      >
        {/* Avatar Image */}
        <img
          src={avatarUrl}
          alt={userName}
          className="w-full h-full object-cover"
        />

        {/* Upload Overlay */}
        {editable && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
            {isUploading ? (
              <Loader className={`${iconSizes[size]} text-white animate-spin`} />
            ) : (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center">
                <Camera className={`${iconSizes[size]} text-white mb-1`} />
                {size !== 'sm' && (
                  <span className="text-white text-xs font-medium">Change</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Drag Active Overlay */}
        {dragActive && (
          <div className="absolute inset-0 bg-blue-500 bg-opacity-50 flex items-center justify-center">
            <Upload className={`${iconSizes[size]} text-white`} />
          </div>
        )}
      </div>

      {/* Action Buttons for larger sizes */}
      {editable && size !== 'sm' && (
        <div className="absolute -bottom-2 -right-2 flex space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            disabled={isUploading}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors disabled:opacity-50"
            title="Change Avatar"
          >
            <Camera className="h-4 w-4" />
          </button>
          
          {currentAvatar && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(true);
              }}
              disabled={isUploading}
              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition-colors disabled:opacity-50"
              title="Delete Avatar"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      {editable && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif"
          onChange={handleFileInputChange}
          className="hidden"
        />
      )}

      {/* Error Message */}
      {error && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-red-100 border border-red-300 text-red-700 text-sm rounded-lg">
          {error}
          <button
            onClick={() => setError('')}
            className="float-right text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Avatar</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete your avatar? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAvatar}
                disabled={isUploading}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isUploading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;