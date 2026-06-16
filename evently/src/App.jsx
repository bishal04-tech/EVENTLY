// import { Switch, Route, Router as WouterRouter } from "wouter";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { Toaster } from "@/components/ui/toaster";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { Layout } from "@/components/layout";
// import NotFound from "@/pages/not-found";

// import HomePage from "@/pages/home";
// import EventsPage from "@/pages/events/index";
// import EventDetailPage from "@/pages/events/detail";
// import CreateEventPage from "@/pages/events/create";
// import EditEventPage from "@/pages/events/edit";
// import DashboardPage from "@/pages/dashboard";
// import OrdersPage from "@/pages/orders/index";
// import CategoriesPage from "@/pages/categories";
// import metrics from "@/pages/metrics";
// import LoginPage from "@/pages/login";
// import RegisterPage from "@/pages/register";
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       retry: false,
//       refetchOnWindowFocus: false,
//     },
//   },
// });
// const ProtectedRoute = ({ component: Component, ...rest }) => {
//   const token = localStorage.getItem("token");
  
//   if (!token) {
//     // If no JWT token is stored, bounce them immediately to login
//     return <Redirect to="/login" />;
//   }

//   return <Component {...rest} />;
// };
// function Router() {
//   return (
//     <Layout>
//       <Switch>
//         <Route path="/" component={HomePage} />
//         <Route path="/events" component={EventsPage} />
//         <Route path="/events/create" component={CreateEventPage} />
//         <Route path="/events/:id" component={EventDetailPage} />
//         <Route path="/events/:id/edit" component={EditEventPage} />
//         <Route path="/dashboard" component={DashboardPage} />
//         <Route path="/orders" component={OrdersPage} />
//         <Route path="/categories" component={CategoriesPage} />
//         <Route path="/metrics" component={metrics} />

//         <Route component={NotFound} />
//       </Switch>
//     </Layout>
//   );
// }

// function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <TooltipProvider>
//         <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, "") || ""}>
//           <Router />
//         </WouterRouter>
//         <Toaster />
//       </TooltipProvider>
//     </QueryClientProvider>
//   );
// }

// export default App;

import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
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

// 1. Import your new authentication components
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

// 2. Simple route guard helper for your private dashboard routes
const ProtectedRoute = ({ component: Component, ...rest }) => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    // If no JWT token is stored, bounce them immediately to login
    return <Redirect to="/login" />;
  }

  return <Component {...rest} />;
};

function Router() {
  return (
    <Switch>
      {/* 3. Auth Routes outside of the general shell layout (Unwrapped) */}
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />

      {/* 4. Catch-all for application routes that require the global navbar/footer container */}
      <Route>
        <Layout>
          <Switch>
            
            <Route path="/">
              {() => <ProtectedRoute component={HomePage} />}
            </Route>
             <Route path="/events">
              {() => <ProtectedRoute component={EventsPage} />}
            </Route>
             <Route path="/events/create">
              {() => <ProtectedRoute component={CreateEventPage} />}
            </Route>
            <Route path="/events/:id">
              {() => <ProtectedRoute component={EventDetailPage} />}
            </Route>
             <Route path="/events/:id/edit">
              {() => <ProtectedRoute component={EditEventPage} />}
            </Route>
            
            <Route path="/metrics">
              {() => <ProtectedRoute component={metrics} />}
            </Route>
            <Route path="/categories">
              {() => <ProtectedRoute component={CategoriesPage} />}
            </Route>

            {/* Guarded Analytics/Order Routes */}
            <Route path="/dashboard">
              {() => <ProtectedRoute component={DashboardPage} />}
            </Route>
            <Route path="/orders">
              {() => <ProtectedRoute component={OrdersPage} />}
            </Route>

            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
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