import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { RouteGuard } from './RouteGuard';

const TestComponent = () => <div>Protected Content</div>;
const LoginComponent = () => <div>Login Page</div>;
const UnauthorizedComponent = () => <div>Unauthorized</div>;

const renderWithRouter = (
  component: React.ReactNode,
  { route = '/' } = {}
) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/custom-login" element={<LoginComponent />} />
        <Route path="/unauthorized" element={<UnauthorizedComponent />} />
        <Route path="/" element={component} />
      </Routes>
    </MemoryRouter>
  );
};

describe('RouteGuard', () => {
  it('should render protected content when authenticated', () => {
    renderWithRouter(
      <RouteGuard isAuthenticated={true}>
        <TestComponent />
      </RouteGuard>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect to login when not authenticated', () => {
    renderWithRouter(
      <RouteGuard isAuthenticated={false}>
        <TestComponent />
      </RouteGuard>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should handle role-based access', () => {
    renderWithRouter(
      <RouteGuard 
        isAuthenticated={true}
        roles={['admin']}
        userRole="user"
      >
        <TestComponent />
      </RouteGuard>
    );

    expect(screen.getByText('Unauthorized')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should allow access with correct role', () => {
    renderWithRouter(
      <RouteGuard 
        isAuthenticated={true}
        roles={['admin']}
        userRole="admin"
      >
        <TestComponent />
      </RouteGuard>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should handle custom redirect paths', async () => {
    renderWithRouter(
      <RouteGuard 
        isAuthenticated={false}
        redirectTo="/custom-login"
      >
        <TestComponent />
      </RouteGuard>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });
}); 