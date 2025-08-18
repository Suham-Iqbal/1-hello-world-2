import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { LandingPage } from "@/pages/LandingPage";
import { SignUpPage } from "@/pages/SignUpPage";
import { LoginPage } from "@/pages/LoginPage";
import { AdminDashboard } from "@/pages/AdminDashboard";
import { CustomerDashboard } from "@/pages/CustomerDashboard";
import { ChatSystem } from "@/components/ChatSystem";
import Index from "@/pages/Index";
import { ActivitiesSystem } from "@/components/ActivitiesSystem";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/customer" element={<CustomerDashboard />} />
          <Route path="/chat" element={<ChatSystem />} />
          <Route path="/activities" element={<ActivitiesSystem />} />
          <Route path="/dashboard" element={<Index />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
