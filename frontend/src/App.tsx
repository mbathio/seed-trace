
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SeedLots from "./pages/SeedLots";
import SeedLotDetail from "./pages/SeedLotDetail";
import Multipliers from "./pages/Multipliers";
import QRCode from "./pages/QRCode";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/seed-lots" element={<SeedLots />} />
          <Route path="/seed-lots/:id" element={<SeedLotDetail />} />
          <Route path="/multipliers" element={<Multipliers />} />
          <Route path="/qr-code" element={<QRCode />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
