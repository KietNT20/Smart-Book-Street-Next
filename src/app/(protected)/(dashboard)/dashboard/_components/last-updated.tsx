'use client';

import { useEffect, useState } from 'react';

interface LastUpdatedProps {
  lastUpdated: Date | null;
  className?: string;
}

export default function LastUpdated({
  lastUpdated,
  className = '',
}: LastUpdatedProps) {
  const [timeAgo, setTimeAgo] = useState<string>('');

  useEffect(() => {
    const updateTimeAgo = (): void => {
      if (!lastUpdated) return;

      const now = new Date();
      const diffInSeconds = Math.floor(
        (now.getTime() - lastUpdated.getTime()) / 1000
      );

      if (diffInSeconds < 60) {
        setTimeAgo('vừa cập nhật vào lúc ' + lastUpdated.toLocaleTimeString());
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        setTimeAgo(`cập nhật ${minutes} phút trước`);
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        setTimeAgo(`cập nhật ${hours} giờ trước`);
      } else {
        const days = Math.floor(diffInSeconds / 86400);
        setTimeAgo(`cập nhật ${days} ngày trước`);
      }
    };
    updateTimeAgo();
    // Cập nhật mỗi phút
    const interval = setInterval(() => {
      updateTimeAgo();
    }, 60000);

    return () => clearInterval(interval);
  }, [lastUpdated]);

  return (
    <span className={`text-sm text-muted-foreground ${className}`}>
      {timeAgo}
    </span>
  );
}
