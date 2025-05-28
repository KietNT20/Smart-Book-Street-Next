import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Upload, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

type Props = {
  onChange: (file: File) => void;
  disabled?: boolean;
};

const FileUploadField = ({ onChange, disabled = false }: Props) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

  const filePreviewUrlRef = useRef<string | null>(null);
  const isUnmountedRef = useRef(false);

  useEffect(() => {
    isUnmountedRef.current = false;

    return () => {
      isUnmountedRef.current = true;
      if (filePreviewUrlRef.current) {
        URL.revokeObjectURL(filePreviewUrlRef.current);
        filePreviewUrlRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (filePreviewUrl) {
      filePreviewUrlRef.current = filePreviewUrl;
    }
  }, [filePreviewUrl]);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (filePreviewUrlRef.current) {
        URL.revokeObjectURL(filePreviewUrlRef.current);
        filePreviewUrlRef.current = null;
      }

      Promise.resolve().then(() => {
        if (!isUnmountedRef.current) {
          setSelectedFile(file);
          onChange(file);

          const url = URL.createObjectURL(file);
          setFilePreviewUrl(url);
          filePreviewUrlRef.current = url;
        }
      });
    },
    [onChange]
  );

  const handleRemoveFile = useCallback(() => {
    if (filePreviewUrlRef.current) {
      URL.revokeObjectURL(filePreviewUrlRef.current);
      filePreviewUrlRef.current = null;
    }

    Promise.resolve().then(() => {
      if (!isUnmountedRef.current) {
        setSelectedFile(null);
        setFilePreviewUrl(null);
        setShowFilePreview(false);

        const fileInput = document.querySelector(
          'input[type="file"]'
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }
    });
  }, []);

  const renderFilePreview = useCallback(() => {
    if (!selectedFile || !filePreviewUrl) return null;

    const fileType = selectedFile.type;
    const fileName = selectedFile.name.toLowerCase();

    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return (
        <div className='h-screen w-full rounded border'>
          <iframe
            src={filePreviewUrl}
            className='h-full w-full'
            title='File Preview'
          />
        </div>
      );
    }

    if (
      fileName.endsWith('.doc') ||
      fileName.endsWith('.docx') ||
      fileType.includes('document') ||
      fileType.includes('officedocument')
    ) {
      return (
        <div className='flex h-96 w-full items-center justify-center rounded border bg-muted'>
          <div className='text-center'>
            <Upload className='mx-auto mb-4 text-muted-foreground' size={48} />
            <p className='mb-4 text-sm text-muted-foreground'>
              Xem trước file Word không được hỗ trợ trực tiếp
            </p>
            <Button
              variant='outline'
              onClick={() => {
                const link = document.createElement('a');
                link.href = filePreviewUrl;
                link.download = selectedFile.name;
                link.click();
              }}
            >
              Tải xuống để xem
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className='flex h-96 w-full items-center justify-center rounded border bg-muted'>
        <div className='text-center'>
          <Upload className='mx-auto mb-4 text-muted-foreground' size={48} />
          <p className='text-sm text-muted-foreground'>
            Không thể xem trước loại file này
          </p>
        </div>
      </div>
    );
  }, [selectedFile, filePreviewUrl]);

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-4'>
        <Input
          type='file'
          accept='.pdf,.doc,.docx'
          onChange={handleFileChange}
          disabled={disabled}
          className='flex-1'
        />
        <Upload className='text-muted-foreground' size={20} />
      </div>

      {selectedFile && (
        <div className='space-y-3'>
          <div className='flex items-center justify-between rounded-lg bg-muted p-3'>
            <div className='flex items-center gap-2 text-sm'>
              <span className='text-muted-foreground'>File đã chọn:</span>
              <span className='font-medium'>{selectedFile.name}</span>
              <span className='text-xs text-muted-foreground'>
                ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>

            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowFilePreview(true)}
                type='button'
                className='h-8 px-3'
              >
                <Eye size={14} className='mr-1' />
                Xem trước
              </Button>
              <Button
                variant='outline'
                size='icon'
                onClick={handleRemoveFile}
                type='button'
                className='h-8 w-8 p-0 text-destructive hover:text-destructive'
              >
                <X size={14} />
              </Button>
            </div>
          </div>

          {showFilePreview && (
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <h4 className='font-medium'>
                  Xem trước file: {selectedFile.name}
                </h4>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setShowFilePreview(false)}
                  type='button'
                  className='h-8 w-8 p-0'
                >
                  <EyeOff size={16} />
                </Button>
              </div>

              {renderFilePreview()}
            </div>
          )}
        </div>
      )}

      <p className='text-xs text-muted-foreground'>
        Chấp nhận file PDF, DOC, DOCX (Tối đa 10MB)
      </p>
    </div>
  );
};

export default FileUploadField;
