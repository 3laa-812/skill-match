import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import Jobs from "@/pages/jobs";
import JobDetails from "@/pages/job-details";
import Skills from "@/pages/skills";
import Matching from "@/pages/matching";
import NotFound from "@/pages/not-found";
import { isAuthenticated } from "@/lib/auth";
import { useLocation } from "wouter";
import { useEffect } from "react";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated()) {
      setLocation("/login");
    }
  }, [setLocation]);

  if (!isAuthenticated()) {
    return null;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/jobs" component={Jobs} />
      <Route path="/jobs/:id" component={JobDetails} />
      <Route path="/skills">
        {() => <ProtectedRoute component={Skills} />}
      </Route>
      <Route path="/matching">
        {() => <ProtectedRoute component={Matching} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="job-match-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Navbar />
          <Router />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
