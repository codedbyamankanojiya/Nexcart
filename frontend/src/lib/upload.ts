import api from './api';

export const uploadAPI = {
  uploadImage: async (file: File): Promise<{ url: string; publicId: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    
    // Use multi-part form data
    const response = await api.post('/api/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  uploadImages: async (files: File[]): Promise<{ images: { url: string; publicId: string }[] }> => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    
    const response = await api.post('/api/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteImage: async (publicId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/api/upload/image/${publicId}`);
    return response.data;
  }
};
