import { TableCell, TableRow } from './ui/table';

type TableSkeletonProps = {
  columns: number;
  rows: number;
};

export function TableSkeleton({ columns, rows }: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TableCell key={colIndex}>
              <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
