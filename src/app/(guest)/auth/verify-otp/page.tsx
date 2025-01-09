'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

export default function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(120); 
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleVerify = async () => {
    setIsVerifying(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsVerifying(false);
    // Handle verification result here
    alert('OTP Verified Successfully!');
  };

  const handleResend = () => {
    setTimeLeft(120);
    setOtp('');
    // Implement resend logic here
    alert('New OTP sent!');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100'>
      <Card className='w-[350px]'>
        <CardHeader>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>Enter the OTP sent to your email</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='mb-4 flex justify-center'>
            <InputOTP
              value={otp}
              onChange={(value) => setOtp(value)}
              maxLength={6}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div className='mt-4'>
            <Progress value={(timeLeft / 120) * 100} className='w-full' />
            <p className='mt-2 text-center text-sm text-gray-500'>
              Time remaining: {formatTime(timeLeft)}
            </p>
          </div>
        </CardContent>
        <CardFooter className='flex justify-between'>
          <Button
            variant='outline'
            onClick={handleResend}
            disabled={timeLeft > 0}
          >
            Resend OTP
          </Button>
          <Button
            onClick={handleVerify}
            disabled={otp.length !== 6 || isVerifying}
          >
            {isVerifying ? 'Verifying...' : 'Verify'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
