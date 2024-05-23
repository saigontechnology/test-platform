import CryptoJS from 'crypto-js';

export const encrypt = (value: string, key: string): string => {
  try {
    const encrypted = CryptoJS.AES.encrypt(value, key).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw error;
  }
};

export const decrypt = (encrypted: string, key: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw error;
  }
};
