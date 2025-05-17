
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LotManagement from "./pages/LotManagement";
import LotRegisterPage from "./pages/LotRegisterPage";
import GenealogyView from "./pages/GenealogyView";
import Quality from "./pages/Quality";
import Parcels from "./pages/Parcels";
import NotFound from "./pages/NotFound";
import Multipliers from "./pages/Multipliers";
import Reports from "./pages/Reports";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/lots" element={<LotManagement />} />
          <Route path="/lots/register" element={<LotRegisterPage />} />
          <Route path="/genealogy" element={<GenealogyView />} />
          <Route path="/quality" element={<Quality />} />
          <Route path="/parcels" element={<Parcels />} />
          <Route path="/multipliers" element={<Multipliers />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
