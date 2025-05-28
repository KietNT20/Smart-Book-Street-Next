'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import { useState } from 'react';

type Props = {
  onVerify: (email: string) => void;
  isLoading?: boolean;
};

const EmailVerificationStep = ({ onVerify, isLoading = false }: Props) => {
  const [email, setEmail] = useState('');

  const handleVerify = () => {
    if (!email.trim() || isLoading) return;
    onVerify(email.trim());
  };

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
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleVerify();
                  }
                }}
              />
              <Button
                onClick={handleVerify}
                disabled={!email.trim() || isLoading}
                variant='outline'
              >
                {isLoading ? 'Đang tìm...' : 'Xác thực'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerificationStep;
