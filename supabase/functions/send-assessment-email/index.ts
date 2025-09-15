import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email: string;
  result: {
    isDiabetic: boolean;
    confidence: number;
    diabetesType: string | null;
    riskFactors: string[];
  };
  healthMetrics: {
    age: string;
    gender: string;
    glucose: string;
    bloodPressure: string;
    bmi: string;
    insulin: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, result, healthMetrics }: EmailRequest = await req.json();

    const riskLevel = result.isDiabetic ? 'High' : 'Low';
    const confidencePercentage = (result.confidence * 100).toFixed(1);

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin-bottom: 10px;">MedGluco AI</h1>
          <h2 style="color: #374151; margin-bottom: 20px;">Diabetes Risk Assessment Results</h2>
        </div>
        
        <div style="background-color: ${result.isDiabetic ? '#fef2f2' : '#f0fdf4'}; border: 1px solid ${result.isDiabetic ? '#fecaca' : '#bbf7d0'}; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: ${result.isDiabetic ? '#dc2626' : '#16a34a'}; margin-top: 0;">
            ${result.isDiabetic ? '⚠️ Diabetes Risk Detected' : '✅ Low Diabetes Risk'}
          </h3>
          <p style="margin: 0; font-size: 16px;">
            ${result.isDiabetic 
              ? 'Your health metrics indicate potential diabetes. Please consult a healthcare provider for proper diagnosis.'
              : 'Based on your health metrics, you show low risk indicators for diabetes.'
            }
          </p>
        </div>

        <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: #374151; margin-top: 0;">Assessment Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Risk Level:</td>
              <td style="padding: 8px 0; font-weight: bold; color: ${result.isDiabetic ? '#dc2626' : '#16a34a'};">${riskLevel}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Confidence Score:</td>
              <td style="padding: 8px 0; font-weight: bold;">${confidencePercentage}%</td>
            </tr>
            ${result.diabetesType ? `
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Diabetes Type:</td>
              <td style="padding: 8px 0; font-weight: bold;">${result.diabetesType}</td>
            </tr>
            ` : ''}
          </table>
        </div>

        <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: #374151; margin-top: 0;">Your Health Metrics</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Age:</td>
              <td style="padding: 8px 0; font-weight: bold;">${healthMetrics.age} years</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Gender:</td>
              <td style="padding: 8px 0; font-weight: bold;">${healthMetrics.gender}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Glucose Level:</td>
              <td style="padding: 8px 0; font-weight: bold;">${healthMetrics.glucose} mg/dL</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Blood Pressure:</td>
              <td style="padding: 8px 0; font-weight: bold;">${healthMetrics.bloodPressure} mmHg</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">BMI:</td>
              <td style="padding: 8px 0; font-weight: bold;">${healthMetrics.bmi}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Insulin Level:</td>
              <td style="padding: 8px 0; font-weight: bold;">${healthMetrics.insulin} μU/mL</td>
            </tr>
          </table>
        </div>

        ${result.riskFactors.length > 0 ? `
        <div style="background-color: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: #92400e; margin-top: 0;">⚠️ Risk Factors Identified</h3>
          <ul style="margin: 0; padding-left: 20px;">
            ${result.riskFactors.map(factor => `<li style="margin-bottom: 5px; color: #92400e;">${factor}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        <div style="background-color: #eff6ff; border: 1px solid #93c5fd; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: #1d4ed8; margin-top: 0;">📋 Medical Disclaimer</h3>
          <p style="margin: 0; color: #1e40af; font-size: 14px;">
            This AI-powered assessment is for informational purposes only and should not replace professional medical advice. 
            Please consult with a healthcare provider for proper diagnosis and treatment.
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            Generated by MedGluco AI - Advanced Diabetes Risk Assessment
          </p>
        </div>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "MedGluco AI <onboarding@resend.dev>",
      to: [email],
      subject: `Your Diabetes Risk Assessment Results - ${riskLevel} Risk`,
      html: emailHtml,
    });

    console.log("Assessment email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, messageId: emailResponse.data?.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-assessment-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);