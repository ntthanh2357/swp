interface AvatarUploadResponse {
  success: boolean;
  avatarUrl?: string;
  error?: string;
}

class AvatarService {
  private apiUrl = '/api/avatar'; // In real app, this would be your backend URL

  // Upload avatar file
  async uploadAvatar(file: File, userId: string): Promise<AvatarUploadResponse> {
    try {
      // Validate file
      if (!this.isValidImageFile(file)) {
        throw new Error('Please select a valid image file (JPG, PNG, GIF under 5MB)');
      }

      console.log(`Uploading avatar for user ${userId}:`, file.name);

      // In real app, this would upload to cloud storage (AWS S3, Cloudinary, etc.)
      // const formData = new FormData();
      // formData.append('avatar', file);
      // formData.append('userId', userId);
      // 
      // const response = await fetch(`${this.apiUrl}/upload`, {
      //   method: 'POST',
      //   body: formData,
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   }
      // });
      // 
      // const result = await response.json();
      // return result;

      // Simulate upload process
      await this.simulateUpload();
      
      // Create blob URL for demo (in real app, this would be the cloud storage URL)
      const avatarUrl = URL.createObjectURL(file);
      
      // Store in localStorage for demo persistence
      localStorage.setItem(`avatar_${userId}`, avatarUrl);

      return {
        success: true,
        avatarUrl
      };
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      return {
        success: false,
        error: error.message || 'Failed to upload avatar'
      };
    }
  }

  // Get user avatar
  async getUserAvatar(userId: string): Promise<string | null> {
    try {
      // In real app, this would fetch from API
      // const response = await fetch(`${this.apiUrl}/${userId}`);
      // const result = await response.json();
      // return result.avatarUrl;

      // For demo, get from localStorage
      return localStorage.getItem(`avatar_${userId}`);
    } catch (error) {
      console.error('Error getting user avatar:', error);
      return null;
    }
  }

  // Delete user avatar
  async deleteAvatar(userId: string): Promise<AvatarUploadResponse> {
    try {
      console.log(`Deleting avatar for user ${userId}`);

      // In real app, this would delete from cloud storage
      // const response = await fetch(`${this.apiUrl}/${userId}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   }
      // });
      // 
      // return response.json();

      // For demo, remove from localStorage
      localStorage.removeItem(`avatar_${userId}`);

      return {
        success: true
      };
    } catch (error: any) {
      console.error('Avatar deletion error:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete avatar'
      };
    }
  }

  // Generate avatar from initials
  generateInitialsAvatar(name: string, size: number = 100): string {
    const initials = name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);

    const colors = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
      '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
    ];
    
    const colorIndex = name.charCodeAt(0) % colors.length;
    const backgroundColor = colors[colorIndex];

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (!ctx) return '';

    // Draw background circle
    ctx.fillStyle = backgroundColor;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
    ctx.fill();

    // Draw initials
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${size * 0.4}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, size / 2, size / 2);

    return canvas.toDataURL();
  }

  // Validate image file
  private isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      return false;
    }

    if (file.size > maxSize) {
      return false;
    }

    return true;
  }

  // Simulate upload delay
  private async simulateUpload(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, 1500);
    });
  }

  // Resize image before upload
  async resizeImage(file: File, maxWidth: number = 300, maxHeight: number = 300, quality: number = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and resize image
        ctx!.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          const resizedFile = new File([blob!], file.name, {
            type: file.type,
            lastModified: Date.now()
          });
          resolve(resizedFile);
        }, file.type, quality);
      };

      img.src = URL.createObjectURL(file);
    });
  }
}

export const avatarService = new AvatarService();
export default avatarService;