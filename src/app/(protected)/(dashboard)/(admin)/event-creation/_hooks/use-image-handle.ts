import { EventFormValues } from '@/lib/zod';
import { useEffect, useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

export const useImageHandle = (form: UseFormReturn<EventFormValues>) => {
  const [previewBaseImg, setPreviewBaseImg] = useState<string | null>(null);
  const [previewOtherImgs, setPreviewOtherImgs] = useState<string[]>([]);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [baseImgFile, setBaseImgFile] = useState<File | null>(null);
  const [otherImgFiles, setOtherImgFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const baseImgInputRef = useRef<HTMLInputElement | null>(null);
  const otherImgsInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  // Image handlers
  const handleBaseImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBaseImgFile(file);
      form.setValue('baseImgFile', file);
      setPreviewBaseImg(URL.createObjectURL(file));
    }
  };

  const handleOtherImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);

      // Update state files
      const currentStateFiles = [...otherImgFiles];
      const newStateFiles = [...currentStateFiles, ...fileArray];
      setOtherImgFiles(newStateFiles);

      // Update form
      const currentFormFiles = form.getValues('otherImgFile') || [];
      const newFormFiles = [...currentFormFiles, ...fileArray];
      form.setValue('otherImgFile', newFormFiles);

      // Update previews
      const newPreviewUrls = fileArray?.map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewOtherImgs((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      form.setValue('videoFile', file);
      setPreviewVideo(URL.createObjectURL(file));
    }
  };

  // Remove handlers
  const removeOtherImage = (index: number) => {
    const updatedStateFiles = [...otherImgFiles];
    updatedStateFiles.splice(index, 1);
    setOtherImgFiles(updatedStateFiles);

    const updatedFormFiles = [...(form.getValues('otherImgFile') || [])];
    updatedFormFiles.splice(index, 1);
    form.setValue('otherImgFile', updatedFormFiles);

    const updatedPreviews = [...previewOtherImgs];
    updatedPreviews.splice(index, 1);
    setPreviewOtherImgs(updatedPreviews);
  };

  const removeBaseImage = () => {
    setBaseImgFile(null);
    form.setValue('baseImgFile', undefined);
    setPreviewBaseImg(null);
  };

  const removeVideo = () => {
    setVideoFile(null);
    form.setValue('videoFile', undefined);
    setPreviewVideo(null);
  };

  const handleRemoveBaseImage = () => {
    removeBaseImage();
    if (baseImgInputRef.current) {
      baseImgInputRef.current.value = '';
    }
  };

  const handleRemoveOtherImage = (index: number) => {
    removeOtherImage(index);
    if (previewOtherImgs.length <= 1 && otherImgsInputRef.current) {
      otherImgsInputRef.current.value = '';
    }
  };

  const handleRemoveVideo = () => {
    removeVideo();
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  // Clean up URLs
  useEffect(() => {
    return () => {
      if (previewBaseImg && !previewBaseImg.startsWith('http')) {
        URL.revokeObjectURL(previewBaseImg);
      }
      previewOtherImgs.forEach((url) => {
        if (!url.startsWith('http')) {
          URL.revokeObjectURL(url);
        }
      });
      if (previewVideo && !previewVideo.startsWith('http')) {
        URL.revokeObjectURL(previewVideo);
      }
    };
  }, [previewBaseImg, previewOtherImgs, previewVideo]);

  return {
    previewBaseImg,
    previewOtherImgs,
    previewVideo,
    baseImgFile,
    otherImgFiles,
    videoFile,
    baseImgInputRef,
    otherImgsInputRef,
    videoInputRef,
    handleBaseImageChange,
    handleOtherImagesChange,
    handleVideoChange,
    handleRemoveBaseImage,
    handleRemoveOtherImage,
    handleRemoveVideo,
  };
};
