import DairyHero from "@/components/DairyHero";
import ToolsSection from "@/components/ToolsSection";
import MilkYieldForm from "@/components/MilkYieldForm";
import ChatInterface from "@/components/ChatInterface";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <DairyHero />
      <ToolsSection />
      <MilkYieldForm />
      <ChatInterface />
    </div>
  );
};

export default Index;
