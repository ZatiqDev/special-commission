import { ApiResponse } from "@/types/api";
import { DashboardFilters } from "@/types/api";

export const fetchCommissionData = async (filters: DashboardFilters): Promise<ApiResponse> => {
  const params = new URLSearchParams({
    from: filters.from,
    to: filters.to,
  });
  
  if (filters.promo_id) {
    params.append('promo_id', filters.promo_id);
  }

  const response = await fetch(`/api/commission?${params}`, {
    cache: 'no-store', // for always fresh data in client-side
  });
  
  if (!response.ok) {
    if (response.status === 404) {
      const errorData = await response.json();
      if (errorData.error === 'PROMO_NOT_FOUND') {
        throw new Error('PROMO_NOT_FOUND');
      }
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  return data;
};