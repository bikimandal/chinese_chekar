export interface Item {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
  category: {
    id: string;
    name: string;
  } | null;
  product: {
    id: string;
    name: string;
  } | null;
  isAvailable: boolean;
  isVisible: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export interface FormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  image: string;
  categoryId: string;
  isAvailable: boolean;
  isVisible: boolean;
}

