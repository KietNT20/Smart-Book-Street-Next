'use client';

import { useEffect, useState } from 'react';

function useDebounce<T>(changedValue: T, delayTime: number): T {
  // State to store the debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(changedValue);

  useEffect(() => {
    // Set a timeout to update the debounced value after delayTime
    const timeoutId = setTimeout(() => {
      setDebouncedValue(changedValue);
    }, delayTime);

    // Clear the timeout if changedValue changes before delayTime
    return () => clearTimeout(timeoutId);
  }, [changedValue, delayTime]);

  return debouncedValue;
}

export default useDebounce;
