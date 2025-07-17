import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { SubscriptionRecord } from "@/types/api";
import { useState, useMemo, useEffect } from "react";

interface DataTableProps {
  data: SubscriptionRecord[];
}

export const DataTable = ({ data }: DataTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const itemsPerPage = 20;

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = useMemo(() => data.slice(startIndex, endIndex), [data, startIndex, endIndex]);

  const getStatusBadgeVariant = (status: string | null | undefined) => {
    if (!status) return 'outline';
    
    switch (status.toLowerCase()) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatAmount = (amount: string) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2,
    }).format(parseFloat(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shop</TableHead>
              <TableHead>Subscription ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((record) => (
              <TableRow key={record.subscription_id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{record.shop_name}</div>
                    <div className="text-sm text-muted-foreground">
                      ID: {record.shop_id}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {record.subscription_id}
                </TableCell>
                <TableCell>{formatAmount(record.amount)}</TableCell>
                <TableCell className="font-medium">
                  {formatAmount(record.commission_amount)}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(record.status)}>
                    {record.status || 'Unknown'}
                  </Badge>
                </TableCell>
                <TableCell className="capitalize">
                  {record.subscription_type.replace('_', ' ')}
                </TableCell>
                <TableCell>{formatDate(record.created_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col xl:flex-row gap-4 items-center justify-between">
          <div className="text-sm text-muted-foreground text-center xl:text-left text-nowrap">
            Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} entries
          </div>
          
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {/* Simple page number logic */}
              {(() => {
                const pages = [];
                const maxVisiblePages = isMobile ? 3 : 5;
                
                if (totalPages <= maxVisiblePages) {
                  // Show all pages if total is small
                  for (let i = 1; i <= totalPages; i++) {
                    pages.push(i);
                  }
                } else {
                  // Always show first page
                  pages.push(1);
                  
                  // Calculate the range around current page
                  let start = Math.max(2, currentPage - 1);
                  let end = Math.min(totalPages - 1, currentPage + 1);
                  
                  // Adjust for mobile to show fewer pages
                  if (isMobile) {
                    if (currentPage <= 2) {
                      start = 2;
                      end = 2;
                    } else if (currentPage >= totalPages - 1) {
                      start = totalPages - 1;
                      end = totalPages - 1;
                    } else {
                      start = currentPage;
                      end = currentPage;
                    }
                  }
                  
                  // Add ellipsis if needed
                  if (start > 2) {
                    pages.push('...');
                  }
                  
                  // Add middle pages
                  for (let i = start; i <= end; i++) {
                    pages.push(i);
                  }
                  
                  // Add ellipsis if needed
                  if (end < totalPages - 1) {
                    pages.push('...');
                  }
                  
                  // Always show last page
                  if (totalPages > 1) {
                    pages.push(totalPages);
                  }
                }
                
                return pages.map((page, index) => {
                  if (page === '...') {
                    return (
                      <PaginationItem key={`ellipsis-${index}`} className="hidden sm:inline-flex">
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page as number)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                });
              })()}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};