import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header role="banner" className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4">
          <h1 className="text-2xl font-bold">DHG Baseline</h1>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer role="contentinfo" className="bg-gray-100">
        <div className="max-w-7xl mx-auto py-4 px-4">
          <p>&copy; 2024 DHG Baseline</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 