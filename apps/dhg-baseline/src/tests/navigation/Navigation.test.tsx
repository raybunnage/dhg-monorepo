import { screen, fireEvent, waitFor, act } from '@testing-library/react';
import { renderWithProviders, mockNavigate } from '../test-utils';
import App from '../../App';
import { Routes, Route } from 'react-router-dom';
import React from 'react';

describe('Navigation', () => {
  const mockToggleLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render home page by default', async () => {
    await renderWithProviders(
      <App />,
      { initialEntries: ['/'] }
    );
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    });
  });

  it('should handle 404 page', async () => {
    await renderWithProviders(
      <App />,
      { initialEntries: ['/nonexistent'] }
    );
    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
  });

  it('should navigate between pages', async () => {
    const mockAuthContext = {
      isLoggedIn: false,
      toggleLogin: mockToggleLogin,
      login: jest.fn().mockImplementation(async () => {
        await Promise.resolve();
        mockToggleLogin();
        return true;
      })
    };

    await renderWithProviders(
      <App />,
      { 
        initialEntries: ['/'],
        authValue: mockAuthContext
      }
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    });
    
    await act(async () => {
      const form = screen.getByRole('form');
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'validpassword123' } });
      
      fireEvent.submit(form);
      await mockAuthContext.login('test@example.com', 'validpassword123');
    });
    
    await waitFor(() => {
      expect(mockToggleLogin).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
}); 