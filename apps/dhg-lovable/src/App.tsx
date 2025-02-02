import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Experts from "@/pages/Experts";
import DocumentTypes from "@/pages/DocumentTypes";
import NotFound from "@/pages/NotFound";

function App() {
  console.log("App rendering, available components:", {
    Index: !!Index,
    Experts: !!Experts,
    DocumentTypes: !!DocumentTypes
  });

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/experts" element={<Experts />} />
        <Route path="/document-types" element={<DocumentTypes />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;