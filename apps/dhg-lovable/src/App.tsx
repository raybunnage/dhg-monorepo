import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Experts from "@/pages/Experts";
import DocumentTypes from "@/pages/DocumentTypes";
import NotFound from "@/pages/NotFound";
import { Layout } from './components/layout/Layout'

// Debug environment variables
console.log('Environment Variables:', {
  env: import.meta.env.VITE_APP_ENV,
  api: import.meta.env.VITE_API_URL,
  supabase: import.meta.env.VITE_SUPABASE_URL,
  appUrl: import.meta.env.VITE_APP_URL
})

function App() {
  console.log("App rendering, available components:", {
    Index: !!Index,
    Experts: !!Experts,
    DocumentTypes: !!DocumentTypes
  });

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="/experts" element={<Experts />} />
          <Route path="/document-types" element={<DocumentTypes />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;