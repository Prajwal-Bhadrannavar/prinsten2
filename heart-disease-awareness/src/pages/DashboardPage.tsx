import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, TrendingUp, Calendar, Activity, LogOut, User, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { assessmentAPI, userAPI } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Assessment {
  _id: string;
  riskScore: number;
  riskLevel: 'low' | 'moderate' | 'high';
  createdAt: string;
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

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [healthInsights, setHealthInsights] = useState<HealthInsights | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [assessmentsData, insightsData] = await Promise.all([
          assessmentAPI.getHistory(),
          userAPI.getHealthInsights()
        ]);
        setAssessments(assessmentsData);
        setHealthInsights(insightsData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const chartData = {
    labels: assessments.slice(0, 7).reverse().map((_, index) => {
      const date = new Date(assessments[assessments.length - 1 - index].createdAt);
      return date.toLocaleDateString();
    }),
    datasets: [
      {
        label: 'Risk Score',
        data: assessments.slice(0, 7).reverse().map(a => a.riskScore),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-red-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-600 mr-2" />
                <span className="text-gray-700">{user?.username}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.username}!
          </h2>
          <p className="text-gray-600">
            Here's your heart health overview and recent activity.
          </p>
        </div>

        {/* Quick Actions */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${user?.isAdmin ? '7' : '6'} gap-6 mb-8`}>
          <Link
            to="/assessment"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <Activity className="h-8 w-8 text-red-500 mb-3" />
            <h3 className="text-lg font-semibold mb-1">New Assessment</h3>
            <p className="text-gray-600 text-sm">Take a heart risk assessment</p>
          </Link>
          
          <Link
            to="/lifestyle"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <TrendingUp className="h-8 w-8 text-red-500 mb-3" />
            <h3 className="text-lg font-semibold mb-1">Lifestyle Tracker</h3>
            <p className="text-gray-600 text-sm">Track daily health metrics</p>
          </Link>
          
          <Link
            to="/education"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <Heart className="h-8 w-8 text-red-500 mb-3" />
            <h3 className="text-lg font-semibold mb-1">Learn More</h3>
            <p className="text-gray-600 text-sm">Educational resources</p>
          </Link>
          
          <Link
            to="/emergency"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <Calendar className="h-8 w-8 text-red-500 mb-3" />
            <h3 className="text-lg font-semibold mb-1">Emergency Guide</h3>
            <p className="text-gray-600 text-sm">Emergency procedures</p>
          </Link>
          
          <Link
            to="/contact"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <Phone className="h-8 w-8 text-red-500 mb-3" />
            <h3 className="text-lg font-semibold mb-1">Find Hospitals</h3>
            <p className="text-gray-600 text-sm">Locate nearby heart hospitals</p>
          </Link>
          
          <Link
            to="/doctor-dashboard"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <User className="h-8 w-8 text-red-500 mb-3" />
            <h3 className="text-lg font-semibold mb-1">Doctor Portal</h3>
            <p className="text-gray-600 text-sm">Manage articles & content</p>
          </Link>
          
          {user?.isAdmin && (
            <Link
              to="/admin"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <Heart className="h-8 w-8 text-red-500 mb-3" />
              <h3 className="text-lg font-semibold mb-1">Admin Portal</h3>
              <p className="text-gray-600 text-sm">Verify doctors & manage</p>
            </Link>
          )}
        </div>

        {/* Charts and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Risk Score Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Risk Score Trend</h3>
            {assessments.length > 0 ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <div className="text-center py-8 text-gray-500">
                No assessment data available. Take your first assessment to see trends.
              </div>
            )}
          </div>

          {/* Health Insights */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Health Insights</h3>
            {healthInsights && healthInsights.averages ? (
              <div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">{healthInsights.averages.steps || 0}</div>
                    <div className="text-sm text-gray-600">Avg Daily Steps</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">{healthInsights.averages.water || 0}</div>
                    <div className="text-sm text-gray-600">Avg Water Glasses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-500">{healthInsights.averages.sleep || 0}</div>
                    <div className="text-sm text-gray-600">Avg Sleep Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">{healthInsights.averages.exercise || 0}</div>
                    <div className="text-sm text-gray-600">Avg Exercise Min</div>
                  </div>
                </div>
                {healthInsights.insights && healthInsights.insights.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Recommendations:</h4>
                    <ul className="space-y-1">
                      {healthInsights.insights.map((insight, index) => (
                        <li key={index} className="text-sm text-gray-700">· {insight}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Start tracking your lifestyle data to see insights.
              </div>
            )}
          </div>
        </div>

        {/* Recent Assessments */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold">Recent Assessments</h3>
          </div>
          <div className="p-6">
            {assessments.length > 0 ? (
              <div className="space-y-4">
                {assessments.slice(0, 5).map((assessment) => (
                  <div key={assessment._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Risk Assessment</div>
                      <div className="text-sm text-gray-600">{new Date(assessment.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(assessment.riskLevel)}`}>
                        {assessment.riskLevel.toUpperCase()}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Score: {assessment.riskScore}/100
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No assessments yet. <Link to="/assessment" className="text-red-500 hover:text-red-600">Take your first assessment</Link>.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
