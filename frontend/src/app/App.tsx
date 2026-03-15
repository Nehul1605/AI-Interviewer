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

export default function App() {
  const isSignInPage = window.location.pathname === "/signin";
  const isSignUpPage = window.location.pathname === "/signup";

  if (isSignInPage) {
    return <SignIn />;
  }

  if (isSignUpPage) {
    return <SignUp />;
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
