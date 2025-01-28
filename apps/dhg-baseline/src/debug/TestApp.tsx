// Remove unused React import if not using JSX.Element
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import { AuthProvider } from '../context/AuthContext';

const TestApp = () => {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
};

export default TestApp; 