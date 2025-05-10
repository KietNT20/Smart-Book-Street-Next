'use client';

import tokenMethod, {
  getLocalStorageItem,
  removeLocalStorageItem,
  TokenTypes,
} from '@/utils/token';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const PaymentRedirectHandler = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePaymentReturn = () => {
      // Check if the user is on the /orders page and if payment is in progress
      const paymentInProgress = getLocalStorageItem<boolean>(
        'paymentInProgress',
        false
      );

      // Check if the user is on the /orders page
      if (paymentInProgress && pathname?.includes('/orders')) {
        const savedToken = getLocalStorageItem<TokenTypes | null>(
          'savedPaymentToken',
          null
        );

        if (savedToken) {
          tokenMethod.set(savedToken);

          removeLocalStorageItem('savedPaymentToken');
          removeLocalStorageItem('paymentInProgress');

          router.refresh();
        }
      }
    };

    window.addEventListener('focus', handlePaymentReturn);

    handlePaymentReturn();

    return () => {
      window.removeEventListener('focus', handlePaymentReturn);
    };
  }, [pathname, router]);

  return null;
};

export default PaymentRedirectHandler;
