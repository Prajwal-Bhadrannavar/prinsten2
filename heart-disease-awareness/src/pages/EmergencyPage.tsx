import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Phone, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const EmergencyPage: React.FC = () => {
  const [checkedSymptoms, setCheckedSymptoms] = useState<string[]>([]);

  const emergencySymptoms = [
    'Chest pain or discomfort',
    'Pain or discomfort in jaw, neck, or back',
    'Pain or discomfort in arms or shoulders',
    'Shortness of breath',
    'Feeling weak, light-headed, or faint',
    'Cold sweat or nausea',
    'Sudden severe headache',
    'Sudden confusion or trouble speaking',
    'Sudden vision problems',
    'Sudden trouble walking or loss of balance'
  ];

  const emergencyActions = [
    {
      title: 'Call Emergency Services Immediately',
      description: 'Dial 112 for general emergency or 108 for medical emergency immediately. Do not wait to see if symptoms go away.',
      icon: Phone,
      color: 'red'
    },
    {
      title: 'Stop All Activity',
      description: 'Sit or lie down immediately and rest. Do not drive yourself to the hospital.',
      icon: AlertTriangle,
      color: 'yellow'
    },
    {
      title: 'Chew Aspirin (If Recommended)',
      description: 'If you have been prescribed aspirin for heart conditions, chew one regular-strength tablet while waiting for emergency services.',
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Stay Calm',
      description: 'Try to remain calm and breathe slowly. Panic can worsen symptoms.',
      icon: Heart,
      color: 'blue'
    }
  ];

  const firstAidSteps = [
    {
      title: 'Recognize the Signs',
      items: [
        'Chest discomfort: pressure, squeezing, fullness, or pain',
        'Discomfort in other areas: arms, back, neck, jaw, or stomach',
        'Shortness of breath with or without chest discomfort',
        'Other signs: breaking out in a cold sweat, nausea, or lightheadedness'
      ]
    },
    {
      title: 'Immediate Response',
      items: [
        'Call 112 immediately for general emergency or 108 for medical emergency - every minute counts',
        'Stop activity and rest in a comfortable position',
        'Loosen tight clothing',
        'Stay with the person and keep them calm',
        'If unconscious, check breathing and pulse'
      ]
    },
    {
      title: 'What NOT to Do',
      items: [
        'Do NOT ignore symptoms or wait to see if they go away',
        'Do NOT drive yourself to the hospital',
        'Do NOT eat or drink anything except prescribed medications',
        'Do NOT take any medication unless specifically prescribed'
      ]
    }
  ];

  const handleSymptomCheck = (symptom: string) => {
    setCheckedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const getEmergencyLevel = () => {
    const criticalSymptoms = [
      'Chest pain or discomfort',
      'Shortness of breath',
      'Sudden severe headache',
      'Sudden confusion or trouble speaking'
    ];

    const hasCritical = checkedSymptoms.some(s => criticalSymptoms.includes(s));
    
    if (hasCritical) {
      return {
        level: 'critical',
        message: 'CALL 112/108 IMMEDIATELY',
        color: 'red',
        description: 'You may be experiencing a medical emergency. Call 112 (general) or 108 (medical) right away.'
      };
    } else if (checkedSymptoms.length >= 3) {
      return {
        level: 'urgent',
        message: 'SEEK MEDICAL ATTENTION',
        color: 'yellow',
        description: 'Your symptoms require prompt medical evaluation. Contact your doctor or visit an emergency room.'
      };
    } else if (checkedSymptoms.length > 0) {
      return {
        level: 'caution',
        message: 'CONSULT A DOCTOR',
        color: 'blue',
        description: 'These symptoms should be discussed with a healthcare provider for proper evaluation.'
      };
    } else {
      return {
        level: 'normal',
        message: 'MONITOR YOUR HEALTH',
        color: 'green',
        description: 'Continue to monitor your health and seek regular check-ups.'
      };
    }
  };

  const emergencyLevel = getEmergencyLevel();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <Heart className="h-8 w-8 text-red-500 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">Emergency Guide</h1>
              </Link>
            </div>
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Emergency Banner */}
        <div className="bg-red-500 text-white rounded-lg p-8 mb-8 text-center">
          <AlertTriangle className="h-16 w-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Heart Emergency: Every Second Counts</h2>
          <p className="text-xl mb-6">
            If you suspect a heart attack or stroke, call emergency services immediately.
          </p>
          <div className="flex justify-center">
            <a
              href="tel:112"
              className="bg-white text-red-500 px-8 py-4 rounded-lg text-xl font-bold hover:bg-gray-100 transition-colors flex items-center"
            >
              <Phone className="h-6 w-6 mr-2" />
              CALL 112
            </a>
          </div>
        </div>

        {/* Symptom Checker */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Emergency Symptom Checker</h3>
          <p className="text-gray-600 mb-6">
            Check all symptoms you or someone else is experiencing:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {emergencySymptoms.map((symptom) => (
              <label
                key={symptom}
                className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={checkedSymptoms.includes(symptom)}
                  onChange={() => handleSymptomCheck(symptom)}
                  className="h-5 w-5 text-red-500 focus:ring-red-500 border-gray-300 rounded"
                />
                <span className="ml-3 text-gray-700">{symptom}</span>
              </label>
            ))}
          </div>

          {/* Emergency Level Assessment */}
          <div className={`p-6 rounded-lg border-2 ${
            emergencyLevel.color === 'red' ? 'bg-red-50 border-red-200' :
            emergencyLevel.color === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
            emergencyLevel.color === 'blue' ? 'bg-blue-50 border-blue-200' :
            'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center mb-3">
              {emergencyLevel.color === 'red' && <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />}
              {emergencyLevel.color === 'yellow' && <Clock className="h-8 w-8 text-yellow-600 mr-3" />}
              {emergencyLevel.color === 'blue' && <AlertTriangle className="h-8 w-8 text-blue-600 mr-3" />}
              {emergencyLevel.color === 'green' && <CheckCircle className="h-8 w-8 text-green-600 mr-3" />}
              <h4 className={`text-xl font-bold ${
                emergencyLevel.color === 'red' ? 'text-red-600' :
                emergencyLevel.color === 'yellow' ? 'text-yellow-600' :
                emergencyLevel.color === 'blue' ? 'text-blue-600' :
                'text-green-600'
              }`}>
                {emergencyLevel.message}
              </h4>
            </div>
            <p className={`${
              emergencyLevel.color === 'red' ? 'text-red-700' :
              emergencyLevel.color === 'yellow' ? 'text-yellow-700' :
              emergencyLevel.color === 'blue' ? 'text-blue-700' :
              'text-green-700'
            }`}>
              {emergencyLevel.description}
            </p>
          </div>
        </div>

        {/* Emergency Actions */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Immediate Emergency Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {emergencyActions.map((action, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className={`mb-4 ${
                  action.color === 'red' ? 'text-red-500' :
                  action.color === 'yellow' ? 'text-yellow-500' :
                  action.color === 'green' ? 'text-green-500' :
                  'text-blue-500'
                }`}>
                  <action.icon className="h-12 w-12" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {action.title}
                </h4>
                <p className="text-gray-600 text-sm">
                  {action.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* First Aid Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {firstAidSteps.map((section, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Important Numbers */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Important Emergency Numbers (India)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-semibold text-gray-900">General Emergency</h4>
              <p className="text-2xl font-bold text-red-500">112</p>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <h4 className="font-semibold text-gray-900">Medical Emergency</h4>
              <p className="text-2xl font-bold text-orange-500">108</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-gray-900">Police</h4>
              <p className="text-2xl font-bold text-blue-500">100</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-gray-900">Fire Services</h4>
              <p className="text-2xl font-bold text-green-500">101</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold text-gray-900">Women Helpline</h4>
              <p className="text-2xl font-bold text-purple-500">1091</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-semibold text-gray-900">Child Helpline</h4>
              <p className="text-2xl font-bold text-yellow-500">1098</p>
            </div>
            <div className="border-l-4 border-indigo-500 pl-4">
              <h4 className="font-semibold text-gray-900">Men's Helpline</h4>
              <p className="text-2xl font-bold text-indigo-500">8882-498-498</p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Important Disclaimer</h4>
              <p className="text-yellow-700 text-sm">
                This emergency guide is for informational purposes only and should not replace professional medical advice. 
                In case of emergency, always call 112 (general) or 108 (medical) immediately. 
                When in doubt, it's always better to seek medical attention promptly.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmergencyPage;
