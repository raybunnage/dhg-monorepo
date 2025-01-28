import AppRoutes from './Routes';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  console.log('🎯 App Component Mounting');

  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
