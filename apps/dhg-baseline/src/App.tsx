import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AppRoutes from './Routes';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  console.log('🎯 App Component Mounting');

  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<AppRoutes />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
};

export default App;
