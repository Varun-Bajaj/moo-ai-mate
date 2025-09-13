import DairyHero from "@/components/DairyHero";
import ToolsSection from "@/components/ToolsSection";
import MilkYieldForm from "@/components/MilkYieldForm";
import DiseaseDetectionForm from "@/components/DiseaseDetectionForm";
import ChatInterface from "@/components/ChatInterface";
import CSVUploadSection from "@/components/CSVUploadSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <DairyHero />
      <ToolsSection />
      <div id="milk-yield-form">
        <MilkYieldForm />
      </div>
      <DiseaseDetectionForm />
      <CSVUploadSection />
      <div id="chat-interface">
        <ChatInterface />
      </div>
    </div>
  );
};

export default Index;
