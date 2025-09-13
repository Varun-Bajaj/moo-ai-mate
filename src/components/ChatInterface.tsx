import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Bot, User } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "नमस्ते! मैं आपका डेयरी AI असिस्टेंट हूं। आप मुझसे दूध उत्पादन, गाय के रोग, या फार्म प्रबंधन के बारे में कुछ भी पूछ सकते हैं।",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [language, setLanguage] = useState<"hi" | "en">("hi");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: language === "hi" 
          ? "मैं आपके सवाल को समझ गया हूं। कृपया अपनी गाय के बारे में अधिक जानकारी दें जैसे कि नस्ल, उम्र, और वर्तमान स्थिति।"
          : "I understand your question. Please provide more details about your cow such as breed, age, and current condition.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <section className="py-20 bg-chat-bg">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            AI Chat Assistant
          </h2>
          <p className="text-xl text-muted-foreground mb-6">
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
          <Card className="h-[500px] flex flex-col shadow-card">
            <CardHeader className="flex flex-row items-center gap-2 py-4 bg-gradient-primary text-white rounded-t-lg">
              <MessageCircle className="w-5 h-5" />
              <CardTitle className="text-lg">Dairy AI Assistant</CardTitle>
              <Badge className="ml-auto bg-white/20">Online</Badge>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.isUser
                        ? 'bg-chat-bubble-user text-white'
                        : 'bg-white border shadow-soft'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {!message.isUser && <Bot className="w-4 h-4 mt-1 text-primary" />}
                      {message.isUser && <User className="w-4 h-4 mt-1" />}
                      <div className="flex-1">
                        <p className={`text-sm ${message.isUser ? 'text-white' : 'text-foreground'}`}>
                          {message.text}
                        </p>
                        <span className={`text-xs ${message.isUser ? 'text-white/70' : 'text-muted-foreground'} mt-1 block`}>
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </CardContent>
            
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder={language === "hi" ? "अपना सवाल यहां लिखें..." : "Type your question here..."}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  className="bg-gradient-primary"
                  size="icon"
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