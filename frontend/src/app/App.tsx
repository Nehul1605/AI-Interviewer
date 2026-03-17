import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { HowItWorks } from "./components/HowItWorks";
import { ScoringSystem } from "./components/ScoringSystem";
import { UseCases } from "./components/UseCases";
import { TechStack } from "./components/TechStack";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";
import { SignIn } from "./components/SignIn";
import { SignUp } from "./components/SignUp";
import { Dashboard } from "./components/Dashboard";
import { HRDashboard } from "./components/HRDashboard";

export default function App() {
  const isSignInPage = window.location.pathname === "/signin";
  const isSignUpPage = window.location.pathname === "/signup";
  const isDashboardPage = window.location.pathname === "/dashboard";
  const isHRDashboardPage = window.location.pathname === "/dashboard/hr";

  // Simple token check for protected routes
  const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };

  if (isSignInPage) {
    return <SignIn />;
  }

  if (isSignUpPage) {
    return <SignUp />;
  }

  // Protected Routes
  if (isDashboardPage) {
    if (!isAuthenticated()) {
      window.location.href = "/signin";
      return null;
    }
    return <Dashboard role="candidate" userName="Candidate" />;
  }

  if (isHRDashboardPage) {
<<<<<<< Updated upstream
    if (!isAuthenticated()) {
      window.location.href = "/signin";
      return null;
    }
    return <Dashboard role="hr" userName="HR" />;
=======
    return <HRDashboard />;
>>>>>>> Stashed changes
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <Hero />
      <Features />
      <HowItWorks />
      <ScoringSystem />
      <UseCases />
      <TechStack />
      <CTA />
      <Footer />
    </div>
  );
}
