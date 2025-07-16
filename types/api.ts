export interface SubscriptionRecord {
  subscription_id: string;
  shop_id: string;
  shop_name: string;
  plan_id: string;
  promo_code_id: string | null;
  renewal_promo_code_id: string | null;
  amount: string;
  commission_amount: string;
  status: string;
  created_at: string;
  subscription_type: string;
}

export interface ApiResponse {
  current_page: number;
  data: SubscriptionRecord[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface DashboardFilters {
  promo_id?: string;
  from: string;
  to: string;
}