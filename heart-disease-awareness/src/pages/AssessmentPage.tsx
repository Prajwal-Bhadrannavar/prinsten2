import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ChevronRight, ChevronLeft, AlertTriangle } from 'lucide-react';
import { assessmentAPI } from '../services/api';

interface Option {
  label: string;
  value: string;
  score: number;
}

interface Question {
  id: number;
  question: string;
  category: 'clinical' | 'behavior';
  source: string;
  options: Option[];
}

interface AssessmentResult {
  riskScore: number;
  awarenessScore: number;
  clinicalRiskIndicator: number;
  riskLevel: 'low' | 'moderate' | 'high';
  recommendations: string[];
  disclaimer: string;
}

const AssessmentPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<{ questionId: number; value: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await assessmentAPI.getQuestions();
        const normalizedQuestions: Question[] = (data || []).map((item: any) => {
          if (Array.isArray(item.options) && item.options.length > 0) {
            return {
              id: item.id,
              question: item.question,
              category: item.category || 'behavior',
              source: item.source || 'Internal assessment',
              options: item.options
            };
          }

          // Backward compatibility with old yes/no question format
          return {
            id: item.id,
            question: item.question,
            category: 'behavior',
            source: 'Legacy assessment format',
            options: [
              { label: 'Yes', value: 'yes', score: typeof item.weight === 'number' ? item.weight : 1 },
              { label: 'No', value: 'no', score: 0 }
            ]
          };
        });
        setQuestions(normalizedQuestions);
      } catch (err) {
        setError('Failed to load questions. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const handleAnswer = (value: string) => {
    const newResponses = [...responses];
    const existingIndex = newResponses.findIndex(r => r.questionId === questions[currentQuestionIndex].id);
    
    if (existingIndex >= 0) {
      newResponses[existingIndex].value = value;
    } else {
      newResponses.push({
        questionId: questions[currentQuestionIndex].id,
        value
      });
    }
    
    setResponses(newResponses);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateRisk();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateRisk = async () => {
    setIsCalculating(true);
    try {
      const result = await assessmentAPI.calculateRisk(responses);
      setResult(result);

      // Save should not block showing result for non-authenticated users.
      try {
        await assessmentAPI.saveAssessment({
          responses,
          riskScore: result.riskScore,
          riskLevel: result.riskLevel,
          awarenessScore: result.awarenessScore ?? 0,
          clinicalRiskIndicator: result.clinicalRiskIndicator ?? 0,
          recommendations: result.recommendations
        });
      } catch (saveError) {
        // Silent fallback: assessment results remain visible even if history save fails.
      }
    } catch (err) {
      setError('Failed to calculate risk. Please try again.');
    } finally {
      setIsCalculating(false);
    }
  };

  const resetAssessment = () => {
    setCurrentQuestionIndex(0);
    setResponses([]);
    setResult(null);
    setError('');
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressBarWidth = () => {
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-12 w-12 text-red-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading assessment questions...</p>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <Heart className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Heart Risk Assessment Results</h2>
            </div>

            <div className="text-center mb-8">
              <div className={`inline-block px-6 py-3 rounded-full font-semibold text-lg ${getRiskColor(result.riskLevel)}`}>
                {result.riskLevel.toUpperCase()} RISK
              </div>
              <div className="mt-4">
                <div className="text-4xl font-bold text-gray-900">{result.riskScore}/100</div>
                <div className="text-gray-600">Overall Risk Score</div>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-lg mx-auto">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-500">Behavior Awareness Score</div>
                  <div className="text-xl font-semibold text-gray-800">{result.awarenessScore ?? 0}/100</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-500">Clinical Risk Indicator</div>
                  <div className="text-xl font-semibold text-gray-800">{result.clinicalRiskIndicator ?? 0}/100</div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
              <ul className="space-y-2">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-yellow-800 text-sm">{result.disclaimer}</p>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={resetAssessment}
                className="flex-1 bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
              >
                Retake Assessment
              </button>
              <Link
                to="/dashboard"
                className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors text-center"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentResponse = responses.find(r => r.questionId === currentQuestion?.id);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              ← Back to Home
            </Link>
            <div className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressBarWidth()}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <Heart className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Heart Risk Assessment</h2>
            <p className="text-gray-600">Answer these questions to evaluate your heart disease risk factors.</p>
          </div>

          {currentQuestion && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-6">{currentQuestion.question}</h3>
              <p className="text-sm text-gray-500 mb-4">
                Category: {currentQuestion.category === 'clinical' ? 'Clinical factors' : 'Lifestyle factors'} | Source: {currentQuestion.source}
              </p>
              
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                      currentResponse?.value === option.value
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Previous
            </button>
            
            <button
              onClick={handleNext}
              disabled={currentResponse === undefined || isCalculating}
              className="flex items-center px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCalculating ? 'Calculating...' : currentQuestionIndex === questions.length - 1 ? 'Get Results' : 'Next'}
              {!isCalculating && <ChevronRight className="h-5 w-5 ml-1" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;
