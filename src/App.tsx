import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "./pages/Dashboard";
import AgentQueue from "./pages/AgentQueue";
import Clients from "./pages/Clients";
import Assignments from "./pages/Assignments";
import ImportHub from "./pages/ImportHub";
import Performance from "./pages/Performance";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/queue" element={<AgentQueue />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/import" element={<ImportHub />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
