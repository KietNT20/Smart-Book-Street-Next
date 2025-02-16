'use client';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { User } from 'lucide-react';

const StatisticalCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User />
          <p>Tổng người dùng</p>
        </CardTitle>
      </CardHeader>
      <CardContent>32</CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default StatisticalCard;
