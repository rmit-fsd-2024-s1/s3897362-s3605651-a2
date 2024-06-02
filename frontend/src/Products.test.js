import React from "react";
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Products from "../src/components/Products";
import {
  fetchProducts,
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} from "../src/data/repository";

jest.clearAllMocks()
jest.mock('axios', () => ({
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
}));
jest.mock("../src/data/repository");

const mockProducts = [
    { product_id: 1, name: 'Product 1', price: 10, isSpecial: false, specialPrice: 8, image: 'product1.jpg', description: 'Description 1', quantity: 1, unit: 'kg' },
    { product_id: 2, name: 'Product 2', price: 20, isSpecial: true, specialPrice: 15, image: 'product2.jpg', description: 'Description 2', quantity: 2, unit: 'kg' },
  ];
  
  const mockCart = [
    { product_id: 1, Product: { name: 'Product 1', price: 10, isSpecial: false, specialPrice: 8 }, quantity: 1 },
  ];
  
  describe('Products Component', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      fetchProducts.mockResolvedValue(mockProducts);
      getCart.mockResolvedValue(mockCart);
    });
  
    it('should clear the cart correctly', async () => {
      clearCart.mockResolvedValue();
      await act(async () => {
        render(<Products changeView={() => {}} />);
      });
      
      await waitFor(() => expect(screen.getByText('Products')).toBeInTheDocument());
  
      fireEvent.click(screen.getByText('Clear Cart'));
      
      await waitFor(() => {
        expect(clearCart).toHaveBeenCalled();
        expect(getCart).toHaveBeenCalled();
        expect(screen.queryByText('Product 1')).toBeNull();
      });
    });
  
    it('should return quantities to products on checkout close', async () => {
      await act(async () => {
        render(<Products changeView={() => {}} />);
      });
      
      await waitFor(() => expect(screen.getByText('Products')).toBeInTheDocument());
      
      fireEvent.click(screen.getByText('Checkout'));
      
      const modalCloseButton = screen.getByLabelText('Close');
      fireEvent.click(modalCloseButton);
  
      await waitFor(() => {
        expect(screen.queryByText('Product 1')).toBeNull();
        const product1 = mockProducts.find(product => product.product_id === 1);
        expect(product1.quantity).toBe(1);
      });
    });
  
    it('should add items to the cart and update product lists correctly', async () => {
      addToCart.mockResolvedValue();
      await act(async () => {
        render(<Products changeView={() => {}} />);
      });
      
      await waitFor(() => expect(screen.getByText('Regular Products')).toBeInTheDocument());
      
      const addToCartButtons = screen.getAllByText('Add to cart');
      fireEvent.click(addToCartButtons[0]);
      
      await waitFor(() => {
        expect(addToCart).toHaveBeenCalledWith(null, 1);
        expect(getCart).toHaveBeenCalled();
        expect(fetchProducts).toHaveBeenCalled();
      });
    });
  });