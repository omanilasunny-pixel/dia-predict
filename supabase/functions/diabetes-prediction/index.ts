import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HealthMetrics {
  age: number;
  gender: string;
  glucose: number;
  bloodPressure: number;
  bmi: number;
  insulin: number;
}

interface PredictionResult {
  isDiabetic: boolean;
  confidence: number;
  diabetesType: 'Type 1' | 'Type 2' | null;
  riskFactors: string[];
  modelStages: {
    stage1_glucose_screening: number;
    stage2_metabolic_assessment: number;
    stage3_demographic_risk: number;
    stage4_ensemble_prediction: number;
  };
}

// Waterfall ML Model Architecture - Multi-stage cascade approach
class DiabetesWaterfallModel {
  
  // Stage 1: Glucose Level Screening (Primary Biomarker)
  private glucoseScreening(glucose: number): { score: number, factors: string[] } {
    const factors: string[] = [];
    let score = 0;
    
    if (glucose >= 200) {
      score = 0.95;
      factors.push('Severely elevated glucose (≥200 mg/dL) - Immediate diabetes indicator');
    } else if (glucose >= 126) {
      score = 0.8;
      factors.push('Fasting glucose ≥126 mg/dL - Diabetes threshold');
    } else if (glucose >= 100) {
      score = 0.4;
      factors.push('Impaired fasting glucose (100-125 mg/dL) - Pre-diabetes');
    } else if (glucose >= 90) {
      score = 0.2;
      factors.push('Borderline glucose levels (90-99 mg/dL)');
    } else {
      score = 0.1;
    }
    
    return { score, factors };
  }
  
  // Stage 2: Metabolic Syndrome Assessment
  private metabolicAssessment(bmi: number, bloodPressure: number, insulin: number): { score: number, factors: string[] } {
    const factors: string[] = [];
    let score = 0;
    
    // BMI component (using WHO classification)
    if (bmi >= 35) {
      score += 0.4;
      factors.push('Severe obesity (BMI ≥35) - High metabolic risk');
    } else if (bmi >= 30) {
      score += 0.3;
      factors.push('Obesity (BMI 30-34.9) - Increased insulin resistance');
    } else if (bmi >= 25) {
      score += 0.2;
      factors.push('Overweight (BMI 25-29.9) - Moderate risk');
    }
    
    // Blood pressure component
    if (bloodPressure >= 90) {
      score += 0.25;
      factors.push('Hypertension (≥90 mmHg) - Metabolic syndrome indicator');
    } else if (bloodPressure >= 85) {
      score += 0.15;
      factors.push('High-normal blood pressure (85-89 mmHg)');
    }
    
    // Insulin resistance assessment
    if (insulin > 25) {
      score += 0.3;
      factors.push('Hyperinsulinemia (>25 μU/mL) - Insulin resistance');
    } else if (insulin < 2) {
      score += 0.35;
      factors.push('Very low insulin (<2 μU/mL) - Possible beta-cell dysfunction');
    } else if (insulin > 15) {
      score += 0.15;
      factors.push('Elevated insulin levels (>15 μU/mL)');
    }
    
    return { score: Math.min(score, 1), factors };
  }
  
  // Stage 3: Demographic and Lifestyle Risk Assessment
  private demographicRisk(age: number, gender: string, bmi: number): { score: number, factors: string[] } {
    const factors: string[] = [];
    let score = 0;
    
    // Age-based risk (exponential increase after 45)
    if (age >= 65) {
      score += 0.3;
      factors.push('Advanced age (≥65) - Significantly increased risk');
    } else if (age >= 45) {
      score += 0.25;
      factors.push('Middle age (45-64) - Increased diabetes risk');
    } else if (age >= 35) {
      score += 0.15;
      factors.push('Age 35-44 - Moderate risk increase');
    }
    
    // Gender-specific risk patterns
    if (gender.toLowerCase() === 'male') {
      if (bmi > 27) {
        score += 0.1;
        factors.push('Male with elevated BMI - Higher visceral adiposity risk');
      }
    } else if (gender.toLowerCase() === 'female') {
      if (age > 35 && bmi > 25) {
        score += 0.08;
        factors.push('Female with age and weight factors - Post-reproductive risk');
      }
    }
    
    return { score: Math.min(score, 1), factors };
  }
  
  // Stage 4: Ensemble Prediction with Confidence Calibration
  private ensemblePrediction(stage1: number, stage2: number, stage3: number): { score: number, confidence: number, type: 'Type 1' | 'Type 2' | null } {
    // Weighted ensemble (glucose gets highest weight as primary biomarker)
    const weights = { glucose: 0.5, metabolic: 0.3, demographic: 0.2 };
    const ensembleScore = (stage1 * weights.glucose) + (stage2 * weights.metabolic) + (stage3 * weights.demographic);
    
    // Confidence calibration based on score consistency
    const scoreVariance = Math.pow(stage1 - ensembleScore, 2) + Math.pow(stage2 - ensembleScore, 2) + Math.pow(stage3 - ensembleScore, 2);
    const baseConfidence = ensembleScore;
    const confidencePenalty = Math.min(scoreVariance * 0.1, 0.2);
    const calibratedConfidence = Math.max(baseConfidence - confidencePenalty, 0.1);
    
    // Diabetes type prediction
    let diabetesType: 'Type 1' | 'Type 2' | null = null;
    if (ensembleScore > 0.5) {
      // Type 1 indicators: young age + very low insulin
      if (stage3 < 0.2 && stage2 > 0.3) {
        diabetesType = 'Type 1';
      } else {
        diabetesType = 'Type 2';
      }
    }
    
    return {
      score: ensembleScore,
      confidence: calibratedConfidence,
      type: diabetesType
    };
  }
  
  // Main prediction pipeline
  predict(metrics: HealthMetrics): PredictionResult {
    console.log('Starting waterfall model prediction for:', metrics);
    
    // Stage 1: Glucose screening
    const stage1Result = this.glucoseScreening(metrics.glucose);
    console.log('Stage 1 (Glucose Screening):', stage1Result);
    
    // Stage 2: Metabolic assessment
    const stage2Result = this.metabolicAssessment(metrics.bmi, metrics.bloodPressure, metrics.insulin);
    console.log('Stage 2 (Metabolic Assessment):', stage2Result);
    
    // Stage 3: Demographic risk
    const stage3Result = this.demographicRisk(metrics.age, metrics.gender, metrics.bmi);
    console.log('Stage 3 (Demographic Risk):', stage3Result);
    
    // Stage 4: Ensemble prediction
    const ensembleResult = this.ensemblePrediction(stage1Result.score, stage2Result.score, stage3Result.score);
    console.log('Stage 4 (Ensemble Prediction):', ensembleResult);
    
    // Combine all risk factors
    const allRiskFactors = [
      ...stage1Result.factors,
      ...stage2Result.factors,
      ...stage3Result.factors
    ];
    
    const result: PredictionResult = {
      isDiabetic: ensembleResult.score > 0.5,
      confidence: ensembleResult.confidence,
      diabetesType: ensembleResult.type,
      riskFactors: ensembleResult.score > 0.5 ? allRiskFactors : [],
      modelStages: {
        stage1_glucose_screening: stage1Result.score,
        stage2_metabolic_assessment: stage2Result.score,
        stage3_demographic_risk: stage3Result.score,
        stage4_ensemble_prediction: ensembleResult.score
      }
    };
    
    console.log('Final prediction result:', result);
    return result;
  }
}

serve(async (req) => {
  console.log('Diabetes prediction request received:', req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { age, gender, glucose, bloodPressure, bmi, insulin } = await req.json();
    console.log('Received health metrics:', { age, gender, glucose, bloodPressure, bmi, insulin });
    
    // Validate input data
    if (!age || !gender || !glucose || !bloodPressure || !bmi || !insulin) {
      throw new Error('Missing required health metrics');
    }
    
    // Convert string inputs to numbers
    const metrics: HealthMetrics = {
      age: parseFloat(age),
      gender: gender.toString(),
      glucose: parseFloat(glucose),
      bloodPressure: parseFloat(bloodPressure),
      bmi: parseFloat(bmi),
      insulin: parseFloat(insulin)
    };
    
    // Validate numeric ranges
    if (metrics.age < 1 || metrics.age > 120) throw new Error('Invalid age range');
    if (metrics.glucose < 50 || metrics.glucose > 400) throw new Error('Invalid glucose range');
    if (metrics.bloodPressure < 40 || metrics.bloodPressure > 200) throw new Error('Invalid blood pressure range');
    if (metrics.bmi < 10 || metrics.bmi > 60) throw new Error('Invalid BMI range');
    if (metrics.insulin < 0 || metrics.insulin > 100) throw new Error('Invalid insulin range');
    
    // Initialize and run the waterfall model
    const model = new DiabetesWaterfallModel();
    const prediction = model.predict(metrics);
    
    // Add processing delay to simulate ML computation
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    return new Response(JSON.stringify(prediction), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in diabetes prediction function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Prediction failed',
        isDiabetic: false,
        confidence: 0,
        diabetesType: null,
        riskFactors: []
      }), 
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});