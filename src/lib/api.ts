// API configuration for Python backend
const API_BASE_URL = 'http://localhost:8000';

export interface EncryptedFile {
  id: string;
  filename: string;
  fingerprint: string;
  hash: string;
  original_size: number;
  encrypted_size: number;
  created_at: string;
  chunk_count: number;
}

export async function uploadAndEncrypt(file: File, password: string): Promise<EncryptedFile> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('password', password);

  const response = await fetch(`${API_BASE_URL}/api/encrypt`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Encryption failed');
  }

  return response.json();
}

export async function listEncryptedFiles(): Promise<EncryptedFile[]> {
  const response = await fetch(`${API_BASE_URL}/api/files`);

  if (!response.ok) {
    throw new Error('Failed to fetch files');
  }

  return response.json();
}

export async function decryptAndDownload(fileId: string, password: string): Promise<{ blob: Blob; filename: string }> {
  const formData = new FormData();
  formData.append('password', password);

  const response = await fetch(`${API_BASE_URL}/api/decrypt/${fileId}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Wrong password or verification failed');
    }
    const error = await response.json();
    throw new Error(error.detail || 'Decryption failed');
  }

  const filename = response.headers.get('X-Original-Filename') || 'decrypted_file';
  const blob = await response.blob();

  return { blob, filename };
}

export async function deleteFile(fileId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/files/${fileId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete file');
  }
}
