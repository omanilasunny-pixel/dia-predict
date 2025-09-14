import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DiabetesForm from '@/components/DiabetesForm';
import DiagnosisResult from '@/components/DiagnosisResult';
import { AuthModal } from '@/components/auth/AuthModal';
import { UserMenu } from '@/components/auth/UserMenu';
import { useAuth } from '@/hooks/useAuth';
import { getPredictionAsync } from '@/utils/diabetesPrediction';
import { Activity, Brain, Database, Shield, Zap, Headphones, MessageCircle, Stethoscope, User } from 'lucide-react';
import heroImage from '@/assets/medical-hero.jpg';

interface HealthMetrics {
  age: string;
  pregnancies: string;
  glucose: string;
  bloodPressure: string;
  bmi: string;
  insulin: string;
}

interface DiagnosisData {
  isDiabetic: boolean;
  confidence: number;
  diabetesType: 'Type 1' | 'Type 2' | null;
  riskFactors: string[];
}

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState<'form' | 'loading' | 'result'>('form');
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleFormSubmit = async (formData: HealthMetrics) => {
    setIsLoading(true);
    setCurrentStep('loading');
    
    try {
      const result = await getPredictionAsync(formData);
      setDiagnosisResult(result);
      setCurrentStep('result');
    } catch (error) {
      console.error('Prediction failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewAssessment = () => {
    setCurrentStep('form');
    setDiagnosisResult(null);
  };

  const renderContent = () => {
    switch (currentStep) {
      case 'form':
        return <DiabetesForm onSubmit={handleFormSubmit} isLoading={isLoading} />;
      case 'loading':
        return <LoadingScreen />;
      case 'result':
        return diagnosisResult ? (
          <DiagnosisResult result={diagnosisResult} onNewAssessment={handleNewAssessment} />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
        <Button 
          className="w-14 h-14 rounded-full shadow-lg glow-effect bg-secondary hover:bg-secondary/90 float-animation"
          size="icon"
          title="Chat with Doctor"
        >
          <Stethoscope className="w-6 h-6" />
        </Button>
        <Button 
          className="w-14 h-14 rounded-full shadow-lg glow-effect bg-accent hover:bg-accent/90 float-animation"
          size="icon"
          title="User Support"
          style={{ animationDelay: '0.5s' }}
        >
          <Headphones className="w-6 h-6" />
        </Button>
      </div>

      {/* Header Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Medical diabetes monitoring equipment" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 hero-gradient opacity-90"></div>
        </div>
        
        <div className="relative container mx-auto px-6 py-16 text-center text-white">
          {/* Auth Button in Header */}
          <div className="absolute top-4 right-4">
            {authLoading ? (
              <div className="w-10 h-10 rounded-full bg-white/20 animate-pulse" />
            ) : user ? (
              <UserMenu />
            ) : (
              <Button 
                onClick={() => setAuthModalOpen(true)}
                variant="outline" 
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
            )}
          </div>
          
          <div className="max-w-4xl mx-auto space-y-6">
            <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 glow-effect">
              <Brain className="w-4 h-4 mr-2" />
              AI-Powered Medical Analysis
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              <span className="block text-primary-glow font-extrabold">MedGluco AI</span>
              Diabetes Risk Assessment
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              Advanced neural network analysis combining clinical data from multiple healthcare databases 
              to provide accurate diabetes screening and risk assessment.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="text-center float-animation">
                <Brain className="w-8 h-8 mx-auto mb-2 text-secondary glow-effect" />
                <div className="text-sm font-semibold">Neural Network</div>
              </div>
              <div className="text-center float-animation" style={{ animationDelay: '0.5s' }}>
                <Zap className="w-8 h-8 mx-auto mb-2 text-accent glow-effect" />
                <div className="text-sm font-semibold">K-NN Algorithm</div>
              </div>
              <div className="text-center float-animation" style={{ animationDelay: '1s' }}>
                <Database className="w-8 h-8 mx-auto mb-2 text-success glow-effect" />
                <div className="text-sm font-semibold">Clinical Data</div>
              </div>
              <div className="text-center float-animation" style={{ animationDelay: '1.5s' }}>
                <Shield className="w-8 h-8 mx-auto mb-2 text-primary-glow glow-effect" />
                <div className="text-sm font-semibold">HIPAA Compliant</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="flex flex-col items-center space-y-8">
          {/* Data Sources Info */}
          {currentStep === 'form' && (
            <Card className="w-full max-w-4xl mb-8 card-shadow">
              <CardHeader>
                <CardTitle className="text-center flex items-center justify-center gap-2">
                  <Database className="w-6 h-6 text-primary" />
                  Clinical Data Sources
                </CardTitle>
                <CardDescription className="text-center">
                  Our AI model is trained on comprehensive healthcare datasets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-lg bg-secondary-light medical-transition hover:scale-105">
                    <div className="font-semibold text-sm text-secondary-foreground">MedPix Database</div>
                    <div className="text-xs text-muted-foreground">Medical Imaging</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-accent-light medical-transition hover:scale-105">
                    <div className="font-semibold text-sm text-accent-foreground">Health Data</div>
                    <div className="text-xs text-muted-foreground">Clinical Records</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-primary/10 medical-transition hover:scale-105">
                    <div className="font-semibold text-sm text-primary">Re3Data</div>
                    <div className="text-xs text-muted-foreground">Research Registry</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-success/10 medical-transition hover:scale-105">
                    <div className="font-semibold text-sm text-success">Global Health Observatory</div>
                    <div className="text-xs text-muted-foreground">WHO Statistics</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Form/Result Content */}
          {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted/50 py-8">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p className="text-sm">
            This diagnostic tool is for informational purposes only and should not replace professional medical advice.
          </p>
        </div>
      </footer>
      
      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
};

// Loading Screen Component
const LoadingScreen = () => (
  <Card className="w-full max-w-2xl card-shadow">
    <CardContent className="py-16">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Analyzing Your Health Data</h3>
          <p className="text-muted-foreground">
            Processing metrics through neural network and K-NN algorithms...
          </p>
        </div>
        
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            Validating input parameters
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            Running neural network analysis
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            Applying K-NN classification
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
            Generating confidence scores
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default Index;
