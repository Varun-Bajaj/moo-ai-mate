import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Bot, User, Lock, AlertCircle } from "lucide-react";
import { usePredictionContext } from "@/contexts/PredictionContext";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatInterface = () => {
  const { hasAnyPrediction, getLatestPrediction } = usePredictionContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [language, setLanguage] = useState<"hi" | "en">("hi");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize welcome message when chat becomes available
  useEffect(() => {
    if (hasAnyPrediction() && messages.length === 0) {
      const welcomeMessage: Message = {
        id: "1",
        text: language === "hi" 
          ? "नमस्ते! मैं आपका डेयरी AI असिस्टेंट हूं। आप अपने prediction results के बारे में कुछ भी पूछ सकते हैं।"
          : "Hello! I'm your Dairy AI Assistant. You can ask me anything about your prediction results.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [hasAnyPrediction, language]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !hasAnyPrediction()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    try {
      const latestPrediction = getLatestPrediction();
      const requestBody = {
        question: currentInput,
        context: latestPrediction ? latestPrediction.data : {},
        lang: language
      };

        const response = await fetch('https://bcs7cd8f-8000.inc1.devtunnels.ms/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const result = await response.json();
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: result.answer || (language === "hi" 
          ? "मैं आपके सवाल को समझ गया हूं। कृपया अपनी गाय के बारे में अधिक जानकारी दें।"
          : "I understand your question. Please provide more details about your cow."),
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: language === "hi" 
          ? "क्षमा करें, मुझे आपके सवाल का जवाब देने में कुछ समस्या आ रही है। कृपया पुनः प्रयास करें।"
          : "Sorry, I'm having trouble responding to your question. Please try again.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            AI Chat Assistant
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            Ask questions about your predictions, cattle health, or farming practices
          </p>
          
          <div className="flex justify-center gap-2 mb-8">
            <Badge 
              variant={language === "hi" ? "default" : "outline"}
              className="cursor-pointer px-4 py-2"
              onClick={() => setLanguage("hi")}
            >
              हिंदी
            </Badge>
            <Badge 
              variant={language === "en" ? "default" : "outline"}
              className="cursor-pointer px-4 py-2"
              onClick={() => setLanguage("en")}
            >
              English
            </Badge>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="h-[500px] flex flex-col shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
             <CardHeader className="flex flex-row items-center gap-2 py-4 bg-gradient-primary text-white rounded-t-lg">
               <MessageCircle className="w-5 h-5" />
               <CardTitle className="text-lg">Dairy AI Assistant</CardTitle>
               <Badge className={`ml-auto ${hasAnyPrediction() ? 'bg-white/20' : 'bg-red-500/20'}`}>
                 {hasAnyPrediction() ? 'Online' : 'Locked'}
               </Badge>
             </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {!hasAnyPrediction() ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Lock className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Chat Locked
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Please complete at least one prediction (Milk Yield, Disease Detection, or CSV Analysis) to unlock the chat feature.
                  </p>
                  <div className="flex gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Complete a prediction first
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.isUser
                            ? 'bg-primary text-white'
                            : 'bg-white dark:bg-gray-800 border dark:border-gray-600 shadow-soft'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {!message.isUser && <Bot className="w-4 h-4 mt-1 text-primary" />}
                          {message.isUser && <User className="w-4 h-4 mt-1" />}
                          <div className="flex-1">
                            <p className={`text-sm ${message.isUser ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                              {message.text}
                            </p>
                            <span className={`text-xs ${message.isUser ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'} mt-1 block`}>
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-gray-800 border dark:border-gray-600 shadow-soft rounded-lg p-3 max-w-[80%]">
                        <div className="flex items-start gap-2">
                          <Bot className="w-4 h-4 mt-1 text-primary animate-pulse" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 dark:text-gray-100">AI is typing...</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </CardContent>
            
            <div className="p-4 border-t dark:border-gray-600">
              <div className="flex gap-2">
                <Input
                  placeholder={
                    hasAnyPrediction() 
                      ? (language === "hi" ? "अपना सवाल यहां लिखें..." : "Type your question here...")
                      : "Complete a prediction to unlock chat..."
                  }
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  disabled={!hasAnyPrediction()}
                />
                <Button 
                  onClick={handleSendMessage}
                  className="bg-primary hover:bg-primary/90"
                  size="icon"
                  disabled={!hasAnyPrediction() || isLoading}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ChatInterface;