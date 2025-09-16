interface HealthMetrics {
  age: string;
  gender: string;
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

// Simulated ML model combining Neural Network and K-NN approaches
export const predictDiabetes = (metrics: HealthMetrics): DiagnosisData => {
  const age = parseFloat(metrics.age);
  const gender = metrics.gender.toLowerCase();
  const glucose = parseFloat(metrics.glucose);
  const bloodPressure = parseFloat(metrics.bloodPressure);
  const bmi = parseFloat(metrics.bmi);
  const insulin = parseFloat(metrics.insulin);

  // Simulate neural network scoring
  let riskScore = 0;
  const riskFactors: string[] = [];

  // Glucose level assessment (primary indicator)
  if (glucose >= 126) {
    riskScore += 0.4;
    riskFactors.push('Elevated fasting glucose level (≥126 mg/dL)');
  } else if (glucose >= 100) {
    riskScore += 0.2;
    riskFactors.push('Pre-diabetic glucose range (100-125 mg/dL)');
  }

  // BMI assessment
  if (bmi >= 30) {
    riskScore += 0.25;
    riskFactors.push('Obesity (BMI ≥30)');
  } else if (bmi >= 25) {
    riskScore += 0.15;
    riskFactors.push('Overweight (BMI 25-29.9)');
  }

  // Age factor
  if (age >= 45) {
    riskScore += 0.15;
    riskFactors.push('Age ≥45 years');
  } else if (age >= 35) {
    riskScore += 0.1;
  }

  // Blood pressure
  if (bloodPressure >= 90) {
    riskScore += 0.1;
    riskFactors.push('High diastolic blood pressure (≥90 mmHg)');
  } else if (bloodPressure >= 80) {
    riskScore += 0.05;
  }

  // Insulin levels
  if (insulin > 25 || insulin < 2) {
    riskScore += 0.1;
    riskFactors.push('Abnormal insulin levels');
  }

  // Gender factor
  if (gender === 'male' && bmi > 28) {
    riskScore += 0.05;
    riskFactors.push('Male gender with elevated BMI');
  } else if (gender === 'female' && age > 35 && bmi > 25) {
    riskScore += 0.03;
    riskFactors.push('Female gender with age and weight factors');
  }

  // K-NN simulation: adjust score based on combination patterns
  const combinedRiskPattern = glucose > 140 && bmi > 25 && age > 40;
  if (combinedRiskPattern) {
    riskScore += 0.1;
  }

  // Normalize score between 0 and 1
  riskScore = Math.min(riskScore, 1);

  // Determine diabetes type based on age and insulin levels
  let diabetesType: 'Type 1' | 'Type 2' | null = null;
  if (riskScore > 0.5) {
    if (age < 30 && insulin < 10) {
      diabetesType = 'Type 1';
    } else {
      diabetesType = 'Type 2';
    }
  }

  // Add some randomness to simulate model uncertainty
  const confidence = Math.min(riskScore + (Math.random() * 0.1 - 0.05), 1);
  const isDiabetic = confidence > 0.5;

  return {
    isDiabetic,
    confidence: Math.max(confidence, 0.1), // Minimum confidence
    diabetesType: isDiabetic ? diabetesType : null,
    riskFactors: isDiabetic ? riskFactors : []
  };
};

// Call the Python-inspired ML waterfall model via Supabase Edge Function
export const getPredictionAsync = async (metrics: HealthMetrics): Promise<DiagnosisData> => {
  try {
    const { supabase } = await import('../integrations/supabase/client');
    
    console.log('Calling diabetes prediction edge function with:', metrics);
    
    const { data, error } = await supabase.functions.invoke('diabetes-prediction', {
      body: metrics
    });
    
    if (error) {
      console.error('Edge function error:', error);
      // Fallback to local prediction if edge function fails
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(predictDiabetes(metrics));
        }, 1000);
      });
    }
    
    console.log('Edge function response:', data);
    
    // Transform the response to match the expected interface
    return {
      isDiabetic: data.isDiabetic,
      confidence: data.confidence,
      diabetesType: data.diabetesType,
      riskFactors: data.riskFactors
    };
    
  } catch (error) {
    console.error('Error calling prediction service:', error);
    // Fallback to local prediction
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(predictDiabetes(metrics));
      }, 1000);
    });
  }
};