import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Heart, TrendingUp, Droplets, Moon, Activity, Calendar, Save } from 'lucide-react';
import { userAPI } from '../services/api';

interface LifestyleData {
  _id?: string;
  date: string;
  steps: number;
  waterIntake: number;
  sleepHours: number;
  exerciseMinutes: number;
}

interface HealthInsights {
  averages: {
    steps: number;
    water: number;
    sleep: number;
    exercise: number;
  };
  insights: string[];
}

const LifestylePage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [lifestyleData, setLifestyleData] = useState<LifestyleData>({
    date: selectedDate,
    steps: 0,
    waterIntake: 0,
    sleepHours: 0,
    exerciseMinutes: 0,
  });
  const [historicalData, setHistoricalData] = useState<LifestyleData[]>([]);
  const [healthInsights, setHealthInsights] = useState<HealthInsights | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadHistoricalData();
    loadHealthInsights();
  }, []);

  const loadHistoricalData = async () => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      
      const data = await userAPI.getLifestyleData({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      setHistoricalData(data);
    } catch (error) {
      console.error('Failed to load historical data:', error);
    }
  };

  const loadHealthInsights = async () => {
    try {
      const insights = await userAPI.getHealthInsights();
      setHealthInsights(insights);
    } catch (error) {
      console.error('Failed to load health insights:', error);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      await userAPI.saveLifestyleData({
        ...lifestyleData,
        date: selectedDate,
      });
      setMessage('Data saved successfully!');
      loadHistoricalData();
      loadHealthInsights();
    } catch (error) {
      setMessage('Failed to save data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof LifestyleData, value: number) => {
    setLifestyleData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const getTodayData = useCallback(() => {
    const today = selectedDate;
    const existingData = historicalData.find(data => 
      new Date(data.date).toISOString().split('T')[0] === today
    );
    
    if (existingData) {
      setLifestyleData({
        date: today,
        steps: existingData.steps,
        waterIntake: existingData.waterIntake,
        sleepHours: existingData.sleepHours,
        exerciseMinutes: existingData.exerciseMinutes,
      });
    } else {
      setLifestyleData({
        date: today,
        steps: 0,
        waterIntake: 0,
        sleepHours: 0,
        exerciseMinutes: 0,
      });
    }
  }, [selectedDate, historicalData]);

  useEffect(() => {
    getTodayData();
  }, [getTodayData]);

  const getHealthScore = (data: LifestyleData) => {
    let score = 0;
    
    // Steps scoring (max 25 points)
    if (data.steps >= 10000) score += 25;
    else if (data.steps >= 8000) score += 20;
    else if (data.steps >= 5000) score += 15;
    else if (data.steps >= 3000) score += 10;
    else score += 5;
    
    // Water intake scoring (max 25 points)
    if (data.waterIntake >= 8) score += 25;
    else if (data.waterIntake >= 6) score += 20;
    else if (data.waterIntake >= 4) score += 15;
    else score += 10;
    
    // Sleep scoring (max 25 points)
    if (data.sleepHours >= 7 && data.sleepHours <= 9) score += 25;
    else if (data.sleepHours >= 6 && data.sleepHours <= 10) score += 20;
    else score += 10;
    
    // Exercise scoring (max 25 points)
    if (data.exerciseMinutes >= 30) score += 25;
    else if (data.exerciseMinutes >= 20) score += 20;
    else if (data.exerciseMinutes >= 15) score += 15;
    else score += 10;
    
    return score;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center">
                <Heart className="h-8 w-8 text-red-500 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">Lifestyle Tracker</h1>
              </Link>
            </div>
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Health Insights */}
        {healthInsights && healthInsights.averages && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">30-Day Health Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-500">{(healthInsights.averages.steps || 0).toLocaleString()}</div>
                <div className="text-sm text-gray-600">Avg Daily Steps</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500">{healthInsights.averages.water || 0}</div>
                <div className="text-sm text-gray-600">Avg Water Glasses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-500">{healthInsights.averages.sleep || 0}</div>
                <div className="text-sm text-gray-600">Avg Sleep Hours</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">{healthInsights.averages.exercise || 0}</div>
                <div className="text-sm text-gray-600">Avg Exercise Min</div>
              </div>
            </div>
            
            {healthInsights.insights && healthInsights.insights.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Personalized Recommendations:</h3>
                <div className="space-y-2">
                  {healthInsights.insights.map((insight, index) => (
                    <div key={index} className="flex items-start">
                      <TrendingUp className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{insight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily Input Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Track Today's Activities</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-2" />
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Activity className="h-4 w-4 inline mr-2" />
                  Daily Steps
                </label>
                <input
                  type="number"
                  value={lifestyleData.steps}
                  onChange={(e) => handleInputChange('steps', parseInt(e.target.value) || 0)}
                  min="0"
                  max="100000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter steps"
                />
                <p className="text-sm text-gray-500 mt-1">Goal: 10,000 steps per day</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Droplets className="h-4 w-4 inline mr-2" />
                  Water Intake (glasses)
                </label>
                <input
                  type="number"
                  value={lifestyleData.waterIntake}
                  onChange={(e) => handleInputChange('waterIntake', parseInt(e.target.value) || 0)}
                  min="0"
                  max="20"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter number of glasses"
                />
                <p className="text-sm text-gray-500 mt-1">Goal: 8 glasses per day</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Moon className="h-4 w-4 inline mr-2" />
                  Sleep Hours
                </label>
                <input
                  type="number"
                  value={lifestyleData.sleepHours}
                  onChange={(e) => handleInputChange('sleepHours', parseFloat(e.target.value) || 0)}
                  min="0"
                  max="24"
                  step="0.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter hours of sleep"
                />
                <p className="text-sm text-gray-500 mt-1">Goal: 7-9 hours per night</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Activity className="h-4 w-4 inline mr-2" />
                  Exercise Minutes
                </label>
                <input
                  type="number"
                  value={lifestyleData.exerciseMinutes}
                  onChange={(e) => handleInputChange('exerciseMinutes', parseInt(e.target.value) || 0)}
                  min="0"
                  max="300"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter exercise minutes"
                />
                <p className="text-sm text-gray-500 mt-1">Goal: 30 minutes per day</p>
              </div>
            </div>

            {message && (
              <div className={`mt-4 p-3 rounded-md ${
                message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {message}
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={isLoading}
              className="w-full mt-6 bg-red-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                'Saving...'
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Save Today's Data
                </>
              )}
            </button>
          </div>

          {/* Health Score and Recent Data */}
          <div className="space-y-6">
            {/* Health Score */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Today's Health Score</h3>
              <div className="text-center">
                <div className={`text-5xl font-bold mb-2 ${getScoreColor(getHealthScore(lifestyleData))}`}>
                  {getHealthScore(lifestyleData)}
                </div>
                <div className="text-lg text-gray-600 mb-4">out of 100</div>
                <div className={`inline-block px-4 py-2 rounded-full font-medium ${
                  getHealthScore(lifestyleData) >= 80 ? 'bg-green-100 text-green-700' :
                  getHealthScore(lifestyleData) >= 60 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {getScoreLabel(getHealthScore(lifestyleData))}
                </div>
              </div>
            </div>

            {/* Recent Entries */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Entries</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {historicalData.slice(0, 7).map((data) => (
                  <div key={data._id} className="border-b border-gray-200 pb-3 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-gray-900">
                        {new Date(data.date).toLocaleDateString()}
                      </div>
                      <div className={`text-sm font-medium ${getScoreColor(getHealthScore(data))}`}>
                        {getHealthScore(data)}/100
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>Steps: {data.steps.toLocaleString()}</div>
                      <div>Water: {data.waterIntake} glasses</div>
                      <div>Sleep: {data.sleepHours} hrs</div>
                      <div>Exercise: {data.exerciseMinutes} min</div>
                    </div>
                  </div>
                ))}
                {historicalData.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No data yet. Start tracking your daily activities!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LifestylePage;
