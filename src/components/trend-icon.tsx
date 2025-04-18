'use client';

import { Trend } from '@/types/person-types';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';

interface TrendIconProps {
  trend: Trend;
  className?: string;
}

const TrendIcon = ({ trend, className = '' }: TrendIconProps) => {
  switch (trend) {
    case Trend.INCREASE:
      return <TrendingUp className={`text-card ${className}`} />;
    case Trend.DECREASE:
      return <TrendingDown className={`text-card ${className}`} />;
    case Trend.STABLE:
    default:
      return <Minus className={`text-card ${className}`} />;
  }
};

export default TrendIcon;
