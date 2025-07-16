"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { DollarSign, TrendingUp, Users, Activity } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { DataTable } from "@/components/dashboard/DataTable";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { Header } from "@/components/layout/Header";
import { fetchCommissionData } from "@/services/api";
import { DashboardFilters as Filters, SubscriptionRecord, ApiResponse } from "@/types/api";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<Filters>({
    promo_id: "14",
    from: "2024-06-01",
    to: "2025-06-30",
  });
  
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await fetchCommissionData(filters);
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]); // Depend on filters

  // Initial load and when filters change
  useEffect(() => {
    fetchData();
  }, [fetchData]); // Include fetchData in dependency array

  const handleApplyFilters = () => {
    startTransition(() => {
      fetchData();
    });
  };

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    if (error) {
      const errorMessage = (error as Error).message;
      
      if (errorMessage === 'PROMO_NOT_FOUND') {
        toast({
          title: "Promo Not Found",
          description: `Promo ID "${filters.promo_id}" could not be found. Please check and try again.`,
          variant: "destructive",
        });
      } else if (errorMessage?.includes('HTTP error')) {
        toast({
          title: "Network Error", 
          description: "Failed to connect to the server. Please check your connection and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch commission data. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [error, toast, filters.promo_id]);

  const records = data?.data || [];
  
  // Filter records by subscription type
  const firstTimeRecords = records.filter((record: SubscriptionRecord) => record.subscription_type === 'first_time');
  const recurringRecords = records.filter((record: SubscriptionRecord) => record.subscription_type !== 'first_time');
  
  // Calculate metrics
  const totalCommission = records.reduce(
    (sum: number, record: SubscriptionRecord) => sum + parseFloat(record.commission_amount),
    0
  );
  
  const totalTransactions = records.length;
  
  const completedTransactions = records.filter(
    (record: SubscriptionRecord) => record.status && record.status.toLowerCase() === "completed"
  ).length;
  
  const uniqueShops = new Set(records.map((record: SubscriptionRecord) => record.shop_id)).size;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Commission Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor subscription commissions and performance metrics
            </p>
          </div>

        {/* Filters */}
        <DashboardFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onApplyFilters={handleApplyFilters}
        />

        {/* Loading State */}
        {(isLoading || isPending) && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Error State */}
        {!isLoading && !isPending && error && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-500 mb-2">Error loading data</p>
              <p className="text-sm text-muted-foreground">{error.message}</p>
              <button 
                onClick={() => fetchData()} 
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* No Data State */}
        {!isLoading && !isPending && !error && (!data || !data.data || data.data.length === 0) && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">No data found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
            </div>
          </div>
        )}

        {/* Metrics */}
        {!isLoading && !isPending && !error && data && data.data && data.data.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricsCard
                title="Total Commission"
                value={formatCurrency(totalCommission)}
                description="Total earned commission"
                icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
              />
              <MetricsCard
                title="Total Transactions"
                value={totalTransactions}
                description="All subscription records"
                icon={<Activity className="h-4 w-4 text-muted-foreground" />}
              />
              <MetricsCard
                title="Completed"
                value={completedTransactions}
                description={`${Math.round((completedTransactions / totalTransactions) * 100)}% completion rate`}
                icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
              />
              <MetricsCard
                title="Unique Shops"
                value={uniqueShops}
                description="Active shop partners"
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
              />
            </div>

            {/* Data Table with Tabs */}
            <Tabs defaultValue="first-time" className="space-y-4">
              <TabsList>
                <TabsTrigger value="first-time">
                  First Time ({firstTimeRecords.length})
                </TabsTrigger>
                <TabsTrigger value="recurring">
                  Recurring ({recurringRecords.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="first-time">
                <Card>
                  <CardHeader>
                    <CardTitle>First Time Subscriptions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {firstTimeRecords.length > 0 ? (
                      <DataTable data={firstTimeRecords} />
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No first time subscription records found
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="recurring">
                <Card>
                  <CardHeader>
                    <CardTitle>Recurring Subscriptions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recurringRecords.length > 0 ? (
                      <DataTable data={recurringRecords} />
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No recurring subscription records found
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
        </div>
      </div>
    </div>
  );
};

export default Index;
