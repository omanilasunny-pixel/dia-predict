import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Headphones, User, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
}

interface SupportChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SupportChat = ({ open, onOpenChange }: SupportChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m here to help you with any questions about using MedGluco AI. Whether you need help with the diabetes assessment form, understanding your results, or navigating the app, I\'m here to assist you. How can I help you today?',
      sender: 'support',
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
      // Simulate support response
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const supportResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateSupportResponse(inputValue),
        sender: 'support',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, supportResponse]);
    } catch (error) {
      toast.error('Failed to get support response');
    } finally {
      setIsLoading(false);
    }
  };

  const generateSupportResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('form') || lowerQuestion.includes('fill') || lowerQuestion.includes('enter')) {
      return 'To use the diabetes assessment form, please fill in all the required fields:\n\n• Age: Enter your current age\n• Pregnancies: Number of pregnancies (for females)\n• Glucose: Blood glucose level (mg/dL)\n• Blood Pressure: Diastolic blood pressure (mm Hg)\n• BMI: Body Mass Index\n• Insulin: Insulin level (mu U/ml)\n\nOnce all fields are completed, click "Analyze Health Data" to get your assessment results.';
    }
    
    if (lowerQuestion.includes('result') || lowerQuestion.includes('understand') || lowerQuestion.includes('mean')) {
      return 'Your assessment results include:\n\n• Risk Level: Low, Moderate, or High risk for diabetes\n• Confidence Score: How confident the AI is in the prediction (0-100%)\n• Risk Factors: Key factors contributing to your risk\n• Recommendations: Personalized suggestions for your health\n\nThe analysis uses advanced neural networks and clinical data to provide accurate assessments. Remember, this is for informational purposes and should not replace professional medical advice.';
    }
    
    if (lowerQuestion.includes('accurate') || lowerQuestion.includes('reliable') || lowerQuestion.includes('trust')) {
      return 'MedGluco AI uses state-of-the-art machine learning algorithms trained on comprehensive healthcare datasets including MedPix Database, clinical records, and WHO statistics. While our AI provides highly accurate assessments, it\'s designed as a screening tool and should complement, not replace, professional medical consultation.';
    }
    
    if (lowerQuestion.includes('data') || lowerQuestion.includes('privacy') || lowerQuestion.includes('safe')) {
      return 'Your privacy and data security are our top priorities. All health data is processed securely and is HIPAA compliant. Your information is encrypted and never shared with third parties. The assessment is performed locally and your data is only used to generate your personalized results.';
    }
    
    if (lowerQuestion.includes('doctor') || lowerQuestion.includes('medical')) {
      return 'You can chat with our Dr. AI assistant by clicking the stethoscope icon in the bottom right corner. Dr. AI can answer general medical questions about diabetes, symptoms, and health topics. For specific medical concerns, always consult with a qualified healthcare professional.';
    }
    
    if (lowerQuestion.includes('help') || lowerQuestion.includes('support') || lowerQuestion.includes('problem')) {
      return 'I\'m here to help! You can ask me about:\n\n• How to use the assessment form\n• Understanding your results\n• App features and navigation\n• Data privacy and security\n• Technical issues\n\nWhat specific area would you like assistance with?';
    }
    
    return 'Thank you for your question! I\'m here to help you with any aspect of using MedGluco AI. Could you please provide more details about what you need assistance with? I can help with form completion, result interpretation, app navigation, or any other features of the application.';
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
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <Headphones className="w-6 h-6 text-accent" />
            </div>
            <div>
              <DialogTitle className="text-xl">Customer Support</DialogTitle>
              <DialogDescription>
                Get help with using MedGluco AI
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
                          message.sender === 'support' 
                            ? 'bg-accent text-accent-foreground' 
                            : 'bg-secondary text-secondary-foreground'
                        }>
                          {message.sender === 'support' ? <HelpCircle className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="text-sm font-medium mb-1">
                          {message.sender === 'support' ? 'Support Agent' : 'You'}
                        </div>
                        <div className="text-sm text-muted-foreground whitespace-pre-line">{message.text}</div>
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
                        <AvatarFallback className="bg-accent text-accent-foreground">
                          <HelpCircle className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="text-sm font-medium mb-1">Support Agent</div>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
              placeholder="How can we help you?"
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading || !inputValue.trim()}
              className="accent-gradient"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};