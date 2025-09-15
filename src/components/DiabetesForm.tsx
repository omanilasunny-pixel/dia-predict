import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Activity, User, Zap } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface HealthMetrics {
  age: string;
  gender: string;
  glucose: string;
  bloodPressure: string;
  bmi: string;
  insulin: string;
}

interface DiabetesFormProps {
  onSubmit: (data: HealthMetrics) => void;
  isLoading: boolean;
}

const DiabetesForm: React.FC<DiabetesFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<HealthMetrics>({
    age: '',
    gender: '',
    glucose: '',
    bloodPressure: '',
    bmi: '',
    insulin: ''
  });

  const handleInputChange = (field: keyof HealthMetrics) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSelectChange = (field: keyof HealthMetrics) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(formData);
  };

  const isFormValid = Object.values(formData).every(value => value.trim() !== '');

  return (
    <Card className="w-full max-w-2xl card-shadow medical-transition">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 rounded-full medical-gradient">
            <Activity className="w-8 h-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Health Assessment Form</CardTitle>
        <CardDescription className="text-base">
          Please provide your health metrics for accurate diabetes screening analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Age */}
            <div className="space-y-2">
              <Label htmlFor="age" className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Age (years)
              </Label>
              <Input
                id="age"
                type="number"
                min="1"
                max="120"
                placeholder="e.g., 35"
                value={formData.age}
                onChange={handleInputChange('age')}
                className="medical-transition focus:medical-focus"
                required
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender" className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Gender
              </Label>
              <Select value={formData.gender} onValueChange={handleSelectChange('gender')} required>
                <SelectTrigger className="medical-transition focus:medical-focus">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Glucose Level */}
            <div className="space-y-2">
              <Label htmlFor="glucose" className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Glucose Level (mg/dL)
              </Label>
              <Input
                id="glucose"
                type="number"
                min="50"
                max="300"
                placeholder="e.g., 120"
                value={formData.glucose}
                onChange={handleInputChange('glucose')}
                className="medical-transition focus:medical-focus"
                required
              />
            </div>

            {/* Blood Pressure */}
            <div className="space-y-2">
              <Label htmlFor="bloodPressure" className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                Blood Pressure (diastolic)
              </Label>
              <Input
                id="bloodPressure"
                type="number"
                min="40"
                max="120"
                placeholder="e.g., 80"
                value={formData.bloodPressure}
                onChange={handleInputChange('bloodPressure')}
                className="medical-transition focus:medical-focus"
                required
              />
            </div>

            {/* BMI */}
            <div className="space-y-2">
              <Label htmlFor="bmi" className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Body Mass Index (BMI)
              </Label>
              <Input
                id="bmi"
                type="number"
                step="0.1"
                min="10"
                max="60"
                placeholder="e.g., 25.3"
                value={formData.bmi}
                onChange={handleInputChange('bmi')}
                className="medical-transition focus:medical-focus"
                required
              />
            </div>

            {/* Insulin Level */}
            <div className="space-y-2">
              <Label htmlFor="insulin" className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                Insulin Level (μU/mL)
              </Label>
              <Input
                id="insulin"
                type="number"
                min="0"
                max="300"
                placeholder="e.g., 15"
                value={formData.insulin}
                onChange={handleInputChange('insulin')}
                className="medical-transition focus:medical-focus"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full medical-gradient hover:shadow-lg medical-transition text-lg py-6"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing Health Data...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Get Diabetes Assessment
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DiabetesForm;