export type OrderStatus =
  | 'draft'
  | 'confirmed'
  | 'picking'
  | 'shipped'
  | 'delivered';

export interface OrderItem {
  product: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export const STATUS_FLOW: OrderStatus[] = [
  'draft',
  'confirmed',
  'picking',
  'shipped',
  'delivered',
];

export const orders = new Map<string, Order>();

export function calculateTotal(items: OrderItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}
