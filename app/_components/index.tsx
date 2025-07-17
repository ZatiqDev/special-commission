"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { DollarSign, TrendingUp, Users, Activity } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricsCard } from "@/components/dashboard/metrics-card";
import { DataTable } from "@/components/dashboard/data-table";
import { DashboardFilters } from "@/components/dashboard/dashboard-filters";
import { fetchCommissionData } from "@/services/api";
import { DashboardFilters as Filters, SubscriptionRecord, ApiResponse } from "@/types/api";
import { useToast } from "@/hooks/use-toast";
import { HeaderLayout } from "@/components/layout/header-layout";

const Index = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<Filters>({
    promo_id: "3138",
    from: "2025-07-17",
    to: "2030-06-30",
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
  const recurringRecords = records.filter((record: SubscriptionRecord) => record.subscription_type !== 'first_time' && record.subscription_type === 'renewed' );
  
  // Calculate metrics
  const totalCommission = records.reduce(
    (sum: number, record: SubscriptionRecord) => sum + parseFloat(record.commission_amount),
    0
  );
  
  const totalTransactions = new Set(records.map((record: SubscriptionRecord) => record.subscription_id)).size && records.length > 0 ? records.filter((record: SubscriptionRecord) => record.subscription_id).length : 0;
    
  const completedTransactions = records.filter(
    (record: SubscriptionRecord) => record.status && record.status.toLowerCase() === "completed"
  ).length;
  
  const uniqueShops = new Set(records.map((record: SubscriptionRecord) => record.shop_id)).size && records.length > 0 ? records.filter((record: SubscriptionRecord) => record.shop_id).length : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  console.log("formatCurrency(totalCommission) :", formatCurrency(totalCommission));

  // if (formatCurrency(totalCommission) === "BDTNaN") return

  return (
    <div className="min-h-screen bg-background">
      <HeaderLayout />

    {
       (formatCurrency(totalCommission) !== "BDTNaN") ? 
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
                  <Card >
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
                      {recurringRecords?.length > 0 ? (
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
        : <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 px-6 py-4 border-b border-slate-200 dark:border-slate-600">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600">
                      <Activity className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Data Loading Issue</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Unable to calculate commission metrics</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  {recurringRecords?.length > 0 ? (
                    <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-xl p-4">
                      <DataTable data={recurringRecords} />
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                      <div className="w-12 h-12 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                        <Activity className="h-6 w-6 text-slate-400" />
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 font-medium">No subscription records found</p>
                      <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Please check and try again</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        }
    </div>
  );
};

export default Index;
