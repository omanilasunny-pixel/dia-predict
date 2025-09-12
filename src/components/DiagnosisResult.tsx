import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, RotateCcw, TrendingUp } from 'lucide-react';

interface DiagnosisData {
  isDiabetic: boolean;
  confidence: number;
  diabetesType: 'Type 1' | 'Type 2' | null;
  riskFactors: string[];
}

interface DiagnosisResultProps {
  result: DiagnosisData;
  onNewAssessment: () => void;
}

const DiagnosisResult: React.FC<DiagnosisResultProps> = ({ result, onNewAssessment }) => {
  const { isDiabetic, confidence, diabetesType, riskFactors } = result;

  const getResultColor = () => {
    if (!isDiabetic) return 'success';
    return confidence > 0.7 ? 'destructive' : 'warning';
  };

  const getResultIcon = () => {
    if (!isDiabetic) return <CheckCircle className="w-8 h-8 text-success" />;
    return <AlertTriangle className="w-8 h-8 text-destructive" />;
  };

  const getResultMessage = () => {
    if (!isDiabetic) {
      return {
        title: 'Low Diabetes Risk',
        description: 'Based on your health metrics, you show low risk indicators for diabetes.'
      };
    }
    return {
      title: `Diabetes Risk Detected${diabetesType ? ` - ${diabetesType}` : ''}`,
      description: 'Your health metrics indicate potential diabetes. Please consult a healthcare provider for proper diagnosis.'
    };
  };

  const message = getResultMessage();

  return (
    <div className="w-full max-w-2xl space-y-6 slide-in">
      {/* Main Result Card */}
      <Card className={`card-shadow medical-transition border-l-4 ${
        isDiabetic ? 'border-l-destructive' : 'border-l-success'
      }`}>
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            {getResultIcon()}
          </div>
          <CardTitle className="text-2xl font-bold">{message.title}</CardTitle>
          <CardDescription className="text-base">{message.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Confidence Score */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Confidence Score</span>
              <Badge variant={getResultColor() === 'success' ? 'default' : 'destructive'}>
                {(confidence * 100).toFixed(1)}%
              </Badge>
            </div>
            <Progress value={confidence * 100} className="h-3" />
            <p className="text-sm text-muted-foreground">
              This score represents the model's confidence in the prediction based on your health metrics.
            </p>
          </div>

          {/* Diabetes Type (if applicable) */}
          {isDiabetic && diabetesType && (
            <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-warning" />
                <span className="font-semibold">Diabetes Type Classification</span>
              </div>
              <p className="text-sm">
                The analysis suggests <strong>{diabetesType}</strong> diabetes based on your metrics.
              </p>
            </div>
          )}

          {/* Risk Factors */}
          {riskFactors.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold">Key Risk Factors Identified:</h4>
              <div className="grid gap-2">
                {riskFactors.map((factor, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded bg-muted/50">
                    <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0" />
                    <span className="text-sm">{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-muted-foreground">
              <strong>Medical Disclaimer:</strong> This AI-powered assessment is for informational purposes only 
              and should not replace professional medical advice. Please consult with a healthcare provider 
              for proper diagnosis and treatment.
            </p>
          </div>

          {/* Action Button */}
          <Button
            onClick={onNewAssessment}
            variant="outline"
            className="w-full medical-transition hover:medical-focus"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            New Assessment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiagnosisResult;