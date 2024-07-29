export enum Status {
  InProgress = 'InProgress',
  Delivery = 'Delivery',
  Finished = 'Finished',
}

export interface OrderedProduct {
  id: string;
  quantity: number;
}

export interface Order {
  id: string;
  status: Status;
  address: string;
  products: OrderedProduct[];
}
