eport interface User {
  id: number;
  phone: string;
  nickname: string;
  avatar: string;
  points: number;
  membership_level: number;
  created_at: string;
}

export interface Store {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  business_hours: string;
  status: number;
  image: string;
}

export interface Category {
  id: number;
  name: string;
  sort_order: number;
  icon: string;
}

export interface Product {
  id: number;
  category_id: number;
  category_name?: string;
  name: string;
  description: string;
  image: string;
  base_price: number;
  status: number;
  is_recommended: number;
  monthly_sales: number;
  spec_groups?: SpecGroup[];
  toppings?: Topping[];
}

export interface SpecGroup {
  id: number;
  group_name: string;
  group_type: string;
  is_required: number;
  options: SpecOption[];
}

export interface SpecOption {
  id: number;
  name: string;
  extra_price: number;
  is_default: number;
}

export interface Topping {
  id: number;
  name: string;
  price: number;
  selected?: boolean;
}

export interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  product_image?: string;
  specs: Record<string, string>;
  toppings: Array<{ id: number; name: string; price: number }>;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: number;
  user_id: number;
  store_id: number;
  store_name: string;
  order_no: string;
  status: number;
  total_price: number;
  discount_amount: number;
  pay_amount: number;
  coupon_id: number | null;
  remark: string;
  created_at: string;
  paid_at: string | null;
  completed_at: string | null;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_image: string;
  specs: Record<string, string>;
  toppings: Array<{ id: number; name: string; price: number }>;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Banner {
  id: number;
  image: string;
  link: string;
  sort_order: number;
}

export interface Coupon {
  id: number;
  name: string;
  type: string;
  value: number;
  min_amount: number;
  start_time: string;
  end_time: string;
  description: string;
  is_used?: number;
  received_at?: string;
}
