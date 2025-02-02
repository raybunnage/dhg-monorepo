import { ReactNode } from "react";
import { Header } from "./Header";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Header />
      <div className="max-w-7xl mx-auto">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};