'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PATH } from '@/enums/path';
import { RoleEnums, RoleLabels } from '@/enums/role';
import { StoreRent } from '@/enums/store-rent';
import { useStoreById } from '@/hooks/use-store';
import { useUserEmail } from '@/hooks/use-user';
import { useUserStoresMutation } from '@/hooks/use-user-store';
import { userStoreFormSchema, UserStoreFormValues } from '@/lib/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import {
  Eye,
  EyeOff,
  Mail,
  Store as StoreIcon,
  Upload,
  User,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

type Props = {
  storeIdParam?: string;
};

const UserStoreForm = ({ storeIdParam }: Props) => {
  // State cho email verification
  const [email, setEmail] = useState('');
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isUserConfirmed, setIsUserConfirmed] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

  const { user, userLoading } = useUserEmail(verifiedEmail);
  const { registerStore, isRegisteringStore } = useUserStoresMutation();

  const form = useForm<UserStoreFormValues>({
    resolver: zodResolver(userStoreFormSchema),
    defaultValues: {
      userId: '',
      storeId: storeIdParam || '',
      contractNumber: '',
      startDate: '',
      endDate: '',
      status: StoreRent.ACTIVE,
      notes: '',
    },
  });

  const storeId = form.watch('storeId');
  const { store, isLoading: isLoadingStore } = useStoreById(storeId);

  // Cleanup URL when component unmounts
  useEffect(() => {
    return () => {
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }
    };
  }, [filePreviewUrl]);

  // Xử lý verify email
  const handleVerifyEmail = () => {
    if (!email.trim()) return;
    setVerifiedEmail(email.trim());
    setIsEmailVerified(true);
  };

  // Kiểm tra user có role StoreOwner và được approve không
  const canRegisterStore = () => {
    if (
      !user?.userRoles ||
      !Array.isArray(user.userRoles) ||
      user.userRoles.length === 0
    )
      return false;

    return user.userRoles.some(
      (userRole) =>
        userRole &&
        userRole.role &&
        userRole.role.roleName &&
        userRole.isApproved === true &&
        (userRole.role.roleName === RoleEnums.STORE_OWNER ||
          userRole.role.roleName === RoleEnums.PUBLISHER)
    );
  };

  // Xử lý confirm user và show form
  const handleConfirmUser = () => {
    if (user?.id && canRegisterStore()) {
      form.setValue('userId', user.id);
      setIsUserConfirmed(true);
    }
  };

  // Reset email verification
  const handleResetEmailVerification = () => {
    setIsEmailVerified(false);
    setIsUserConfirmed(false);
    setEmail('');
    setVerifiedEmail('');
    form.reset({
      userId: '',
      storeId: storeIdParam || '',
      contractNumber: '',
      startDate: '',
      endDate: '',
      status: StoreRent.ACTIVE,
      notes: '',
    });
  };

  function onSubmit(values: UserStoreFormValues) {
    const formData = new FormData();

    formData.append('userId', values.userId);
    formData.append('storeId', values.storeId);
    formData.append('contractNumber', values.contractNumber);
    formData.append('startDate', dayjs(values.startDate).format('YYYY-MM-DD'));
    formData.append('endDate', dayjs(values.endDate).format('YYYY-MM-DD'));
    formData.append('status', values.status);
    formData.append('contractFile', values.contractFile);
    if (values.notes) {
      formData.append('notes', values.notes);
    }

    registerStore(formData, {
      onSuccess: () => {
        form.reset();
        setSelectedFile(null);
        setIsUserConfirmed(false);
        handleResetEmailVerification();
      },
    });
  }

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (file: File) => void
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Cleanup previous URL
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }

      setSelectedFile(file);
      onChange(file);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setFilePreviewUrl(url);
    }
  };

  const handleRemoveFile = () => {
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
    }
    setSelectedFile(null);
    setFilePreviewUrl(null);
    setShowFilePreview(false);

    // Reset input file
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handlePreviewFile = () => {
    setShowFilePreview(true);
  };

  const renderFilePreview = () => {
    if (!selectedFile || !filePreviewUrl) return null;

    const fileType = selectedFile.type;
    const fileName = selectedFile.name.toLowerCase();

    // PDF files
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

    // DOC/DOCX files - browser will try to download or show
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
                link.href = filePreviewUrl!;
                link.download = selectedFile!.name;
                link.click();
              }}
            >
              Tải xuống để xem
            </Button>
          </div>
        </div>
      );
    }

    // Fallback for other file types
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
  };

  // Step 1: Email verification
  if (!isEmailVerified) {
    return (
      <div className='space-y-6'>
        <Card className='w-full'>
          <CardContent className='p-6'>
            <div className='mb-4 flex items-center'>
              <Mail className='mr-2 text-primary' size={20} />
              <h3>Xác thực email người dùng</h3>
            </div>

            <div className='space-y-4'>
              <div className='flex gap-2'>
                <Input
                  placeholder='Nhập email người dùng'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type='email'
                  disabled={userLoading}
                />
                <Button
                  onClick={handleVerifyEmail}
                  disabled={!email.trim() || userLoading}
                  variant='outline'
                >
                  {userLoading ? 'Đang tìm...' : 'Xác thực'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 2: User confirmation
  if (isEmailVerified && !isUserConfirmed) {
    return (
      <div className='space-y-6'>
        <Card className='w-full'>
          <CardContent className='p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <div className='flex items-center'>
                <User className='mr-2 text-matcha' size={20} />
                <h3>Thông tin người dùng</h3>
              </div>
              <Button
                variant='outline'
                size='icon'
                onClick={handleResetEmailVerification}
                className='h-8 w-8 p-0'
              >
                <X size={16} />
              </Button>
            </div>

            {userLoading ? (
              <p className='text-sm text-muted-foreground'>
                Đang tải thông tin người dùng...
              </p>
            ) : user ? (
              <div className='space-y-3'>
                <div className='space-y-2 text-sm'>
                  <div className='flex items-center gap-3'>
                    <span className='min-w-[100px] text-muted-foreground'>
                      Họ tên:
                    </span>
                    <span className='font-medium'>
                      {user?.fullName || 'Chưa cung cấp'}
                    </span>
                  </div>
                  <div className='flex items-center gap-3'>
                    <span className='min-w-[100px] text-muted-foreground'>
                      Email:
                    </span>
                    <span className='font-medium'>
                      {user?.email || 'Chưa cung cấp'}
                    </span>
                  </div>
                  <div className='flex items-center gap-3'>
                    <span className='min-w-[100px] text-muted-foreground'>
                      Số điện thoại:
                    </span>
                    <span className='font-medium'>
                      {user?.phone || 'Chưa cung cấp'}
                    </span>
                  </div>

                  {/* Hiển thị thông tin roles với null checks - FIXED */}
                  <div className='flex items-start gap-3'>
                    <span className='min-w-[100px] text-muted-foreground'>
                      Vai trò:
                    </span>
                    <div className='space-y-1'>
                      {user?.userRoles &&
                      Array.isArray(user.userRoles) &&
                      user.userRoles.length > 0 ? (
                        user.userRoles
                          .filter((userRole) => userRole && userRole.role)
                          .map((userRole, index) => {
                            // Safe key generation
                            const roleKey = `role-${index}-${userRole?.role?.roleName || 'unknown'}`;
                            const roleName = userRole?.role?.roleName;
                            const roleLabel =
                              roleName && typeof roleName === 'string'
                                ? RoleLabels[roleName as RoleEnums] ||
                                  'Chưa cung cấp'
                                : 'Chưa cung cấp';

                            return (
                              <div
                                key={roleKey}
                                className='flex items-center gap-2'
                              >
                                <span className='font-medium'>{roleLabel}</span>
                                <span
                                  className={`rounded-full px-2 py-1 text-xs ${
                                    userRole?.isApproved
                                      ? 'bg-matcha/10 text-matcha'
                                      : 'bg-destructive/10 text-destructive'
                                  }`}
                                >
                                  {userRole?.isApproved
                                    ? 'Đã duyệt'
                                    : 'Chưa duyệt'}
                                </span>
                              </div>
                            );
                          })
                      ) : (
                        <span className='font-medium'>Chưa có vai trò</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className='pt-4'>
                  {canRegisterStore() ? (
                    <Button onClick={handleConfirmUser} className='w-full'>
                      Xác nhận và tiếp tục đăng ký
                    </Button>
                  ) : (
                    <div className='space-y-3'>
                      <div className='rounded-lg bg-destructive/10 p-3 text-center'>
                        <p className='text-sm text-destructive'>
                          Người dùng này không có quyền đăng ký cửa hàng.
                          <br />
                          {`Cần có vai trò "Chủ cửa hàng" hoặc "Nhà xuất bản" và được phê duyệt.`}
                        </p>
                      </div>
                      <Button
                        variant='outline'
                        onClick={() => {
                          setEmail('');
                          setVerifiedEmail('');
                          setIsEmailVerified(false);
                        }}
                        className='w-full'
                      >
                        Thử email khác
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className='py-4 text-center'>
                <p className='mb-4 text-sm text-muted-foreground'>
                  Không tìm thấy người dùng với email này
                </p>
                <Button
                  variant='outline'
                  onClick={() => {
                    setEmail('');
                    setVerifiedEmail('');
                    setIsEmailVerified(false);
                  }}
                >
                  Thử email khác
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 3: Main form - Add loading state check
  if (!user) {
    return (
      <div className='flex items-center justify-center py-8'>
        <p className='text-muted-foreground'>Đang tải thông tin...</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        {/* User Info Display */}
        <Card className='w-full'>
          <CardContent className='p-4'>
            <div className='mb-2 flex items-center justify-between'>
              <div className='flex items-center'>
                <User className='mr-2 text-matcha' size={18} />
                <span className='font-medium'>Người đăng ký</span>
              </div>
              <Button
                variant='outline'
                size='icon'
                onClick={handleResetEmailVerification}
                type='button'
                className='h-8 w-8 p-0'
              >
                <X size={16} />
              </Button>
            </div>
            <div className='space-y-1 text-sm'>
              <div className='flex items-center gap-3'>
                <span className='text-muted-foreground'>Họ tên:</span>
                <span className='font-medium'>{user?.fullName || 'N/A'}</span>
              </div>
              <div className='flex items-center gap-3'>
                <span className='text-muted-foreground'>Email:</span>
                <span className='font-medium'>{user?.email || 'N/A'}</span>
              </div>
              <div className='flex items-start gap-3'>
                <span className='text-muted-foreground'>Vai trò:</span>
                <div className='space-y-1'>
                  {user?.userRoles &&
                  Array.isArray(user.userRoles) &&
                  user.userRoles.length > 0 ? (
                    user.userRoles
                      .filter(
                        (userRole) =>
                          userRole &&
                          userRole.role &&
                          userRole.role.roleName &&
                          userRole.isApproved &&
                          (userRole.role.roleName === RoleEnums.STORE_OWNER ||
                            userRole.role.roleName === RoleEnums.PUBLISHER)
                      )
                      .map((userRole, index) => {
                        // Safe key generation for approved roles
                        const approvedRoleKey = `approved-role-${index}-${userRole?.role?.roleName || 'unknown'}`;
                        const roleName = userRole?.role?.roleName;
                        const roleLabel =
                          roleName && typeof roleName === 'string'
                            ? RoleLabels[roleName as RoleEnums] || 'N/A'
                            : 'N/A';

                        return (
                          <div
                            key={approvedRoleKey}
                            className='flex items-center gap-2'
                          >
                            <span className='font-medium'>{roleLabel}</span>
                            <span className='rounded-full bg-matcha/10 px-2 py-1 text-xs text-matcha'>
                              Đã duyệt
                            </span>
                          </div>
                        );
                      })
                  ) : (
                    <span className='font-medium'>N/A</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Store Selection */}
        <div className='space-y-4'>
          <FormLabel>Cửa hàng</FormLabel>
          {storeId && (
            <Card className='w-full'>
              <CardContent className='p-4'>
                <div className='mb-2 flex items-center'>
                  <StoreIcon className='mr-2 text-primary' size={18} />
                  <span className='font-medium'>Thông tin cửa hàng</span>
                </div>

                {isLoadingStore ? (
                  <p className='text-sm text-muted-foreground'>
                    Đang tải thông tin...
                  </p>
                ) : store ? (
                  <div className='space-y-2 text-sm'>
                    <div className='flex items-center gap-3'>
                      <span className='text-muted-foreground'>
                        Tên cửa hàng:
                      </span>
                      <span className='font-medium'>
                        {store.storeName || 'N/A'}
                      </span>
                    </div>
                    <div className='flex items-center gap-3'>
                      <span className='text-muted-foreground'>Địa chỉ:</span>
                      <span className='font-medium'>
                        {store.address || 'N/A'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className='text-sm text-muted-foreground'>
                    Không tìm thấy thông tin cửa hàng
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <FormField
          control={form.control}
          name='contractNumber'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số hợp đồng</FormLabel>
              <FormControl>
                <Input
                  placeholder='Số hợp đồng'
                  disabled={isRegisteringStore}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='startDate'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày bắt đầu</FormLabel>
                <FormControl>
                  <DatePicker
                    className='h-10 w-full px-3 py-2'
                    format='YYYY-MM-DD'
                    placeholder='Chọn ngày bắt đầu'
                    disabled={isRegisteringStore}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => {
                      field.onChange(date ? date.format('YYYY-MM-DD') : null);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='endDate'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày kết thúc</FormLabel>
                <FormControl>
                  <DatePicker
                    className='h-10 w-full px-3 py-2'
                    format='YYYY-MM-DD'
                    placeholder='Chọn ngày kết thúc'
                    disabled={isRegisteringStore}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => {
                      field.onChange(date ? date.format('YYYY-MM-DD') : null);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='status'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tình trạng</FormLabel>
              <FormControl>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  disabled={isRegisteringStore}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Chọn trạng thái' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={StoreRent.ACTIVE}>Hoạt động</SelectItem>
                    <SelectItem value={StoreRent.EXPIRED}>Hết hạn</SelectItem>
                    <SelectItem value={StoreRent.TERMINATED}>
                      Ngừng hoạt động
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='contractFile'
          render={({ field }) => (
            <FormItem>
              <FormLabel>File hợp đồng</FormLabel>
              <FormControl>
                <div className='space-y-4'>
                  <div className='flex items-center gap-4'>
                    <Input
                      type='file'
                      accept='.pdf,.doc,.docx'
                      onChange={(e) => handleFileChange(e, field.onChange)}
                      disabled={isRegisteringStore}
                      className='flex-1'
                    />
                    <Upload className='text-muted-foreground' size={20} />
                  </div>

                  {selectedFile && (
                    <div className='space-y-3'>
                      <div className='flex items-center justify-between rounded-lg bg-muted p-3'>
                        <div className='flex items-center gap-2 text-sm'>
                          <span className='text-muted-foreground'>
                            File đã chọn:
                          </span>
                          <span className='font-medium'>
                            {selectedFile.name}
                          </span>
                          <span className='text-xs text-muted-foreground'>
                            ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>

                        <div className='flex items-center gap-2'>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={handlePreviewFile}
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

                      {/* File Preview Modal/Section */}
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
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='notes'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  placeholder='Ghi chú'
                  disabled={isRegisteringStore}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex items-center justify-end space-x-2'>
          <Button variant='outline'>
            <Link href={PATH.USER_STORES}>Hủy</Link>
          </Button>
          <Button type='submit' disabled={isRegisteringStore || !storeId}>
            {isRegisteringStore ? 'Đang đăng ký...' : 'Đăng ký'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserStoreForm;
