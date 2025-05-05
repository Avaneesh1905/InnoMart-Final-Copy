import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { CartItem as CartItemType } from '../types';
import { formatCurrency } from '../utils/formatCurrency';

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, change: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onRemove, onUpdateQuantity }) => {
  return (
    <div className="flex items-center py-4 border-b border-gray-200">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img
          src={item.product.image}
          alt={item.product.name}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>{item.product.name}</h3>
            <p className="ml-4">{formatCurrency(item.product.price * item.quantity)}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500 line-clamp-1">{item.product.description}</p>
        </div>
        
        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center">
            <button 
              onClick={() => onUpdateQuantity(item.id, -1)}
              disabled={item.quantity <= 1}
              className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus size={16} />
            </button>
            <span className="mx-2 text-gray-700 w-8 text-center">{item.quantity}</span>
            <button 
              onClick={() => onUpdateQuantity(item.id, 1)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <Plus size={16} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="font-medium text-red-600 hover:text-red-500 flex items-center"
          >
            <Trash2 size={18} />
            <span className="ml-1">Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;