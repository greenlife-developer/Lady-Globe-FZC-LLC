import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Inventory from "./pages/Inventory";
// import Returns from "./pages/Returns";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import UserManagement from "./pages/UserManagement";
import Messages from "./pages/Messages";

// Components
import EnhancedLayout from "./components/EnhancedLayout";
import Register from "./pages/Register";

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
          <Route path="/register" element={<Register />} />
          <Route path="/messages" element={<Messages />} />
          
          {/* Protected Routes with Enhanced Layout */}
          <Route element={<EnhancedLayout />}>
            <Route path="/dashboard" element={<Inventory />} />
            
            {/* Amazon Routes */}
            <Route path="/catalogue" element={<NotFound />} />
            <Route path="/catalogue/add-product" element={<NotFound />} />
            <Route path="/catalogue/listing-quality" element={<NotFound />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/inventory/manage" element={<Inventory />} />
            <Route path="/inventory/planning" element={<NotFound />} />
            <Route path="/advertising" element={<NotFound />} />
            <Route path="/advertising/campaigns" element={<NotFound />} />
            <Route path="/advertising/content" element={<NotFound />} />
            
            {/* Settings and Admin Routes */}
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/users" element={<UserManagement />} />
            <Route path="/settings/messages" element={<Messages />} />
          </Route>
          
          {/* Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
