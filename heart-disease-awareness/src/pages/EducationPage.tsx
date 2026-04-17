import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, BookOpen, ChevronRight, ArrowLeft, User } from 'lucide-react';
import { doctorAPI } from '../services/api';

interface Article {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  readTime: string;
  content: string[];
  author?: string;
  authorSpecialty?: string;
  createdAt?: string;
}

const EducationPage: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [doctorArticles, setDoctorArticles] = useState<any[]>([]);

  useEffect(() => {
    fetchDoctorArticles();
  }, []);

  const fetchDoctorArticles = async () => {
    try {
      const articles = await doctorAPI.getPublishedArticles();
      setDoctorArticles(articles);
    } catch (error) {
      console.error('Failed to fetch doctor articles:', error);
    }
  };

  const articles: Article[] = [
    {
      id: '1',
      title: 'Heart-Healthy Diet Guide',
      category: 'Diet',
      excerpt: 'Learn about the best foods for cardiovascular health and dietary habits that can reduce your risk of heart disease.',
      readTime: '5 min read',
      content: [
        'A heart-healthy diet is one of the most powerful tools for preventing heart disease. The Mediterranean diet, rich in fruits, vegetables, whole grains, and healthy fats, has been shown to significantly reduce cardiovascular risk.',
        'Key components of a heart-healthy diet include:',
        '• Fruits and vegetables: Aim for 5-9 servings daily',
        '• Whole grains: Choose brown rice, whole wheat bread, and oats',
        '• Lean proteins: Fish, poultry, beans, and nuts',
        '• Healthy fats: Olive oil, avocados, and omega-3 fatty acids',
        '• Limited sodium: Less than 2,300mg per day',
        '• Reduced sugar: Avoid sugary drinks and processed foods',
        'Remember to control portion sizes and stay hydrated with plenty of water throughout the day.'
      ]
    },
    {
      id: '2',
      title: 'Exercise for Heart Health',
      category: 'Exercise',
      excerpt: 'Discover the optimal exercise routines and physical activities that strengthen your heart and improve overall cardiovascular fitness.',
      readTime: '4 min read',
      content: [
        'Regular physical activity is essential for maintaining a healthy heart. The American Heart Association recommends at least 150 minutes of moderate-intensity aerobic exercise or 75 minutes of vigorous exercise per week.',
        'Effective heart-healthy exercises include:',
        '• Aerobic activities: Walking, swimming, cycling, and dancing',
        '• Strength training: 2-3 sessions per week',
        '• Flexibility exercises: Stretching and yoga',
        '• High-intensity interval training (HIIT): Short bursts of intense activity',
        'Start slowly if you\'re new to exercise and gradually increase intensity. Always consult with your healthcare provider before beginning a new exercise program, especially if you have existing health conditions.',
        'Remember that consistency is more important than intensity. Find activities you enjoy to make exercise a sustainable part of your lifestyle.'
      ]
    },
    {
      id: '3',
      title: 'Stress Management Techniques',
      category: 'Lifestyle',
      excerpt: 'Explore effective strategies to manage stress and protect your heart from the damaging effects of chronic stress.',
      readTime: '6 min read',
      content: [
        'Chronic stress can significantly impact heart health by increasing blood pressure, heart rate, and inflammation. Learning to manage stress effectively is crucial for cardiovascular wellness.',
        'Proven stress management techniques include:',
        '• Deep breathing exercises: Practice 4-7-8 breathing technique',
        '• Meditation: Start with 10 minutes daily',
        '• Progressive muscle relaxation: Tense and release muscle groups',
        '• Regular exercise: Natural stress reliever',
        '• Adequate sleep: 7-9 hours per night',
        '• Social connections: Maintain relationships with friends and family',
        '• Time management: Prioritize tasks and set realistic goals',
        'Consider professional help if stress becomes overwhelming. Therapy, counseling, or support groups can provide additional tools and support.'
      ]
    },
    {
      id: '4',
      title: 'Understanding Blood Pressure',
      category: 'Health Basics',
      excerpt: 'Learn what blood pressure numbers mean, how to monitor them, and ways to maintain healthy blood pressure levels.',
      readTime: '5 min read',
      content: [
        'Blood pressure is a critical indicator of heart health. It measures the force of blood against your artery walls as your heart pumps.',
        'Understanding your numbers:',
        '• Normal: Less than 120/80 mmHg',
        '• Elevated: 120-129 systolic and less than 80 diastolic',
        '• Stage 1 Hypertension: 130-139 systolic or 80-89 diastolic',
        '• Stage 2 Hypertension: 140/90 mmHg or higher',
        'To maintain healthy blood pressure:',
        '• Monitor regularly at home',
        '• Reduce sodium intake',
        '• Maintain a healthy weight',
        '• Exercise regularly',
        '• Limit alcohol consumption',
        '• Manage stress',
        '• Take prescribed medications as directed',
        'Always consult with your healthcare provider about your blood pressure readings and treatment options.'
      ]
    },
    {
      id: '5',
      title: 'Cholesterol and Heart Health',
      category: 'Health Basics',
      excerpt: 'Understanding the role of cholesterol in heart disease and how to maintain healthy cholesterol levels through diet and lifestyle.',
      readTime: '6 min read',
      content: [
        'Cholesterol is a waxy substance found in your blood. While your body needs cholesterol to build healthy cells, high levels can increase your risk of heart disease.',
        'Types of cholesterol:',
        '• LDL (Low-density lipoprotein): "Bad" cholesterol that can build up in arteries',
        '• HDL (High-density lipoprotein): "Good" cholesterol that helps remove LDL',
        '• Triglycerides: Another type of fat in your blood',
        'Healthy cholesterol levels:',
        '• Total cholesterol: Less than 200 mg/dL',
        '• LDL: Less than 100 mg/dL',
        '• HDL: 60 mg/dL or higher',
        '• Triglycerides: Less than 150 mg/dL',
        'To improve cholesterol levels:',
        '• Eat a heart-healthy diet rich in fiber',
        '• Limit saturated and trans fats',
        '• Exercise regularly',
        '• Maintain a healthy weight',
        '• Quit smoking',
        '• Limit alcohol intake',
        '• Take prescribed medications as directed'
      ]
    },
    {
      id: '6',
      title: 'Sleep and Heart Health',
      category: 'Lifestyle',
      excerpt: 'Discover the crucial connection between quality sleep and cardiovascular health, plus tips for better sleep habits.',
      readTime: '4 min read',
      content: [
        'Quality sleep is essential for heart health. During sleep, your body repairs damage to your heart and blood vessels, and your blood pressure and heart rate typically decrease.',
        'The sleep-heart health connection:',
        '• Adults need 7-9 hours of sleep per night',
        '• Poor sleep increases risk of high blood pressure',
        '• Sleep apnea is strongly linked to heart disease',
        '• Irregular sleep patterns disrupt heart rhythm',
        'Tips for better sleep:',
        '• Maintain a consistent sleep schedule',
        '• Create a relaxing bedtime routine',
        '• Keep your bedroom dark, cool, and quiet',
        '• Avoid screens before bedtime',
        '• Limit caffeine and alcohol, especially in the evening',
        '• Exercise regularly but not close to bedtime',
        '• Manage stress and anxiety',
        'If you suspect sleep apnea or have persistent sleep problems, consult with a healthcare provider for proper diagnosis and treatment.'
      ]
    }
  ];

  const categories = ['All', 'Diet', 'Exercise', 'Lifestyle', 'Health Basics', 'Heart Disease', 'Medication', 'Prevention', 'Symptoms', 'Treatment', 'Research', 'General'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Combine default articles with doctor articles
  const allArticles = [
    ...articles,
    ...doctorArticles.map((docArticle: any) => ({
      id: docArticle._id,
      title: docArticle.title,
      category: docArticle.category,
      excerpt: docArticle.excerpt,
      readTime: docArticle.readTime,
      content: docArticle.content,
      author: docArticle.doctorId?.name,
      authorSpecialty: docArticle.doctorId?.specialty,
      createdAt: docArticle.createdAt,
    }))
  ];

  const filteredArticles = selectedCategory === 'All' 
    ? allArticles 
    : allArticles.filter(article => article.category === selectedCategory);

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setSelectedArticle(null)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Articles
          </button>

          <article className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium mr-3">
                  {selectedArticle.category}
                </span>
                <span>{selectedArticle.readTime}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {selectedArticle.title}
              </h1>
            </div>

            <div className="prose prose-red max-w-none">
              {selectedArticle.content.map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>Medical Disclaimer:</strong> This information is for educational purposes only and should not replace professional medical advice. Always consult with a healthcare provider for medical concerns.
                </p>
              </div>
            </div>
          </article>
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
              <Link to="/" className="flex items-center">
                <Heart className="h-8 w-8 text-red-500 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">Heart Health Education</h1>
              </Link>
            </div>
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <BookOpen className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Learn About Heart Health
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our comprehensive collection of articles on heart disease prevention, healthy lifestyle choices, and cardiovascular wellness.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedArticle(article)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
                    {article.category}
                  </span>
                  <span className="text-sm text-gray-500">{article.readTime}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
                
                {article.author && (
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <User className="h-4 w-4 mr-1" />
                    <span>Dr. {article.author}</span>
                    {article.authorSpecialty && (
                      <span className="ml-2">· {article.authorSpecialty}</span>
                    )}
                  </div>
                )}
                
                <div className="flex items-center text-red-500 hover:text-red-600">
                  <span className="font-medium">Read More</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No articles found in this category.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default EducationPage;
