import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, Stethoscope } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'doctor';
  timestamp: Date;
}

interface DoctorChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DoctorChat = ({ open, onOpenChange }: DoctorChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m Dr. Sarah Mitchell, your virtual medical assistant. I can help answer your health and medical questions. Please note that I\'m not a replacement for professional medical consultation. How can I assist you today?',
      sender: 'doctor',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate AI response with medical context
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const doctorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateMedicalResponse(inputValue),
        sender: 'doctor',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, doctorResponse]);
    } catch (error) {
      toast.error('Failed to get response from Dr. AI');
    } finally {
      setIsLoading(false);
    }
  };

  const generateMedicalResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('diabetes') || lowerQuestion.includes('blood sugar')) {
      return 'Diabetes is a condition where your blood glucose levels are higher than normal. Type 1 diabetes is usually diagnosed in children and young adults, while Type 2 is more common in adults. Key symptoms include increased thirst, frequent urination, fatigue, and blurred vision. It\'s important to monitor blood sugar levels and maintain a healthy diet. Please consult with a healthcare provider for proper diagnosis and treatment.';
    }
    
    if (lowerQuestion.includes('blood pressure') || lowerQuestion.includes('hypertension')) {
      return 'Blood pressure measures the force of blood against artery walls. Normal blood pressure is typically below 120/80 mmHg. High blood pressure (hypertension) can increase risk of heart disease and stroke. Lifestyle changes like regular exercise, reducing sodium intake, and stress management can help. Always consult your doctor for proper monitoring and treatment.';
    }
    
    if (lowerQuestion.includes('symptoms') || lowerQuestion.includes('feel')) {
      return 'Symptoms can vary greatly depending on the condition. Common diabetes symptoms include excessive thirst, frequent urination, unexplained weight loss, fatigue, and slow-healing wounds. If you\'re experiencing concerning symptoms, it\'s best to consult with a healthcare professional for proper evaluation and diagnosis.';
    }
    
    if (lowerQuestion.includes('diet') || lowerQuestion.includes('food')) {
      return 'A healthy diet is crucial for managing diabetes and overall health. Focus on whole grains, lean proteins, vegetables, and fruits. Limit processed foods and sugary drinks. For diabetes management, monitoring carbohydrate intake is important. Consider consulting with a registered dietitian for personalized meal planning.';
    }
    
    return 'Thank you for your question. Based on the information provided, I recommend consulting with a healthcare professional for personalized medical advice. Every individual\'s health situation is unique, and proper medical evaluation is important for accurate diagnosis and treatment. Is there anything specific about general health topics I can help explain?';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl h-[600px] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">Dr. Sarah Mitchell</DialogTitle>
              <DialogDescription>
                Get answers to your medical and health questions
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col gap-4">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <Card key={message.id} className={`${
                  message.sender === 'user' ? 'ml-12' : 'mr-12'
                } card-shadow`}>
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className={
                          message.sender === 'doctor' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-secondary text-secondary-foreground'
                        }>
                          {message.sender === 'doctor' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="text-sm font-medium mb-1">
                          {message.sender === 'doctor' ? 'Dr. Sarah Mitchell' : 'You'}
                        </div>
                        <div className="text-sm text-muted-foreground">{message.text}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {isLoading && (
                <Card className="mr-12 card-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="text-sm font-medium mb-1">Dr. Sarah Mitchell</div>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
          
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a medical question..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading || !inputValue.trim()}
              className="medical-gradient"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};