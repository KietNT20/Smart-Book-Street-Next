'use server';

export const getPublicIdFromUrl = async (url: string) => {
  try {
    const regex = /\/upload\/(?:v\d+\/)?(.+)$/;
    const match = url.match(regex);

    if (match && match[1]) {
      return match[1].replace(/\.[^/.]+$/, '');
    }

    return null;
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return null;
  }
};
