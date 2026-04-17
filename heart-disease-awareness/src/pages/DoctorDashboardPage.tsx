import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, Plus, Edit, Trash2, Eye, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { doctorAPI } from '../services/api';

interface Article {
  _id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string[];
  readTime: string;
  tags: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DoctorProfile {
  _id: string;
  name: string;
  specialty: string;
  licenseNumber: string;
  hospital: string;
  isVerified: boolean;
}

const DoctorDashboardPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    try {
      const [profileData, articlesData] = await Promise.all([
        doctorAPI.getProfile(),
        doctorAPI.getArticles(),
      ]);
      setProfile(profileData);
      setArticles(articlesData);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Doctor profile not found. Please complete verification first.');
      } else {
        setError('Failed to load doctor data');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;

    try {
      await doctorAPI.deleteArticle(articleId);
      setArticles(articles.filter(article => article._id !== articleId));
    } catch (err: any) {
      setError('Failed to delete article');
    }
  };

  const handleTogglePublish = async (articleId: string, currentStatus: boolean) => {
    try {
      await doctorAPI.updateArticle(articleId, { isPublished: !currentStatus });
      setArticles(articles.map(article =>
        article._id === articleId ? { ...article, isPublished: !currentStatus } : article
      ));
    } catch (err: any) {
      setError('Failed to update article status');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            to="/doctor-verification"
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Complete Verification
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        {/* Doctor Profile Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Heart className="h-12 w-12 text-red-500 mr-4" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dr. {profile.name}</h1>
                <p className="text-gray-600">{profile.specialty}</p>
                <p className="text-sm text-gray-500">{profile.hospital}</p>
              </div>
            </div>
            <div className="text-center">
              {profile.isVerified ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-6 w-6 mr-2" />
                  <span className="font-semibold">Verified Doctor</span>
                </div>
              ) : (
                <div className="flex items-center text-yellow-600">
                  <Clock className="h-6 w-6 mr-2" />
                  <span className="font-semibold">Pending Verification</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {!profile.isVerified ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <AlertCircle className="h-6 w-6 text-yellow-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">Verification Pending</h3>
                <p className="text-yellow-700 text-sm">
                  Your verification is under review. You'll be able to create and publish articles once your profile is verified.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Actions Bar */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Articles</h2>
              <Link
                to="/doctor/create-article"
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Article
              </Link>
            </div>

            {/* Articles List */}
            {articles.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Articles Yet</h3>
                <p className="text-gray-600 mb-4">
                  Start creating informative health articles to help the community.
                </p>
                <Link
                  to="/doctor/create-article"
                  className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Create Your First Article
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {articles.map((article) => (
                  <div key={article._id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 mr-3">{article.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            article.isPublished
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {article.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{article.excerpt}</p>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <span>{article.category}</span>
                          <span>·</span>
                          <span>{article.readTime}</span>
                          <span>·</span>
                          <span>Updated {new Date(article.updatedAt).toLocaleDateString()}</span>
                        </div>
                        {article.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {article.tags.map((tag, index) => (
                              <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Link
                          to={`/doctor/edit-article/${article._id}`}
                          className="p-2 text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleTogglePublish(article._id, article.isPublished)}
                          className="p-2 text-green-600 hover:text-green-800"
                          title={article.isPublished ? 'Unpublish' : 'Publish'}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(article._id)}
                          className="p-2 text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboardPage;
