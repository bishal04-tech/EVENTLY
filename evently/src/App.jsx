import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import NotFound from "@/pages/not-found";

import HomePage from "@/pages/home";
import EventsPage from "@/pages/events/index";
import EventDetailPage from "@/pages/events/detail";
import CreateEventPage from "@/pages/events/create";
import EditEventPage from "@/pages/events/edit";
import DashboardPage from "@/pages/dashboard";
import OrdersPage from "@/pages/orders/index";
import CategoriesPage from "@/pages/categories";
import metrics from "@/pages/metrics";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/events" component={EventsPage} />
        <Route path="/events/create" component={CreateEventPage} />
        <Route path="/events/:id" component={EventDetailPage} />
        <Route path="/events/:id/edit" component={EditEventPage} />
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/orders" component={OrdersPage} />
        <Route path="/categories" component={CategoriesPage} />
        <Route path="/metrics" component={metrics} />

        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, "") || ""}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;