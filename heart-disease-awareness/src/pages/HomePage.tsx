import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Activity, BookOpen, AlertTriangle, Users, BarChart3 } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-red-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Heart Disease Awareness</h1>
            </div>
            <nav className="flex space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-gray-900">
                Login
              </Link>
              <Link to="/register" className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                Sign Up
              </Link>
              <Link to="/contact" className="text-gray-600 hover:text-gray-900">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-red-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Protect Your Heart, Secure Your Future
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Take control of your cardiovascular health with our comprehensive heart disease awareness and risk assessment platform.
          </p>
          <Link 
            to="/assessment" 
            className="bg-white text-red-500 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Risk Assessment
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Activity className="h-12 w-12 text-red-500 mb-4" />
              <h4 className="text-xl font-semibold mb-2">Risk Assessment</h4>
              <p className="text-gray-600">
                Interactive questionnaire to evaluate your heart disease risk factors.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <BookOpen className="h-12 w-12 text-red-500 mb-4" />
              <h4 className="text-xl font-semibold mb-2">Educational Content</h4>
              <p className="text-gray-600">
                Learn about heart health, diet, exercise, and prevention strategies.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
              <h4 className="text-xl font-semibold mb-2">Emergency Guide</h4>
              <p className="text-gray-600">
                Critical information on recognizing and responding to heart emergencies.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <BarChart3 className="h-12 w-12 text-red-500 mb-4" />
              <h4 className="text-xl font-semibold mb-2">Lifestyle Tracker</h4>
              <p className="text-gray-600">
                Monitor your daily activities and track your health progress over time.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Users className="h-12 w-12 text-red-500 mb-4" />
              <h4 className="text-xl font-semibold mb-2">Find Doctors</h4>
              <p className="text-gray-600">
                Locate nearby cardiologists and heart specialists in your area.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Heart className="h-12 w-12 text-red-500 mb-4" />
              <h4 className="text-xl font-semibold mb-2">Personal Dashboard</h4>
              <p className="text-gray-600">
                View your assessment history and track your heart health journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Heart Diseases Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Common Heart Conditions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold mb-3 text-red-600">Coronary Artery Disease</h4>
              <p className="text-gray-600 text-sm">
                Narrowing or blockage of the coronary arteries, usually caused by atherosclerosis.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold mb-3 text-red-600">Heart Attack</h4>
              <p className="text-gray-600 text-sm">
                Occurs when blood flow to the heart is severely reduced or blocked.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold mb-3 text-red-600">Arrhythmia</h4>
              <p className="text-gray-600 text-sm">
                Irregular heartbeat that can be too fast, too slow, or erratic.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold mb-3 text-red-600">Heart Failure</h4>
              <p className="text-gray-600 text-sm">
                Chronic condition where the heart doesn't pump blood as well as it should.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-red-500 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-4">
            Take the First Step Towards Heart Health
          </h3>
          <p className="text-xl mb-8">
            Join thousands of users who have taken control of their cardiovascular health.
          </p>
          <div className="space-x-4">
            <Link 
              to="/register" 
              className="bg-white text-red-500 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started Free
            </Link>
            <Link 
              to="/education" 
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-500 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mb-2">
              <strong>Disclaimer:</strong> This platform is for educational purposes only and is not a substitute for professional medical advice.
            </p>
            <p className="text-gray-400">
              © 2024 Heart Disease Awareness System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
