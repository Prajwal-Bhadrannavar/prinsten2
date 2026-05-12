import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Heart, ArrowLeft, Save } from 'lucide-react';
import { doctorAPI } from '../services/api';

interface Article {
  _id?: string;
  title: string;
  category: string;
  excerpt: string;
  content: string[];
  readTime: string;
  tags: string[];
  isPublished: boolean;
}

const DoctorArticleEditorPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [article, setArticle] = useState<Article>({
    title: '',
    category: 'Heart Disease',
    excerpt: '',
    content: [''],
    readTime: '5 min read',
    tags: [''],
    isPublished: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isEditing) return;

    const fetchArticle = async () => {
      try {
        const articles = await doctorAPI.getArticles();
        const foundArticle = articles.find((a: any) => a._id === id);
        if (foundArticle) {
          setArticle(foundArticle);
        } else {
          setError('Article not found');
        }
      } catch (err: any) {
        setError('Failed to load article');
      }
    };

    fetchArticle();
  }, [id, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setArticle(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleContentChange = (index: number, value: string) => {
    const newContent = [...article.content];
    newContent[index] = value;
    setArticle(prev => ({ ...prev, content: newContent }));
  };

  const addContentSection = () => {
    setArticle(prev => ({ ...prev, content: [...prev.content, ''] }));
  };

  const removeContentSection = (index: number) => {
    if (article.content.length > 1) {
      const newContent = article.content.filter((_, i) => i !== index);
      setArticle(prev => ({ ...prev, content: newContent }));
    }
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...article.tags];
    newTags[index] = value;
    setArticle(prev => ({ ...prev, tags: newTags }));
  };

  const addTag = () => {
    setArticle(prev => ({ ...prev, tags: [...prev.tags, ''] }));
  };

  const removeTag = (index: number) => {
    if (article.tags.length > 1) {
      const newTags = article.tags.filter((_, i) => i !== index);
      setArticle(prev => ({ ...prev, tags: newTags }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const filteredContent = article.content.filter(c => c.trim() !== '');
      const filteredTags = article.tags.filter(t => t.trim() !== '');

      const articleData = {
        ...article,
        content: filteredContent,
        tags: filteredTags,
      };

      if (isEditing) {
        await doctorAPI.updateArticle(id!, articleData);
        setSuccess('Article updated successfully!');
      } else {
        await doctorAPI.createArticle(articleData);
        setSuccess('Article created successfully!');
      }

      setTimeout(() => {
        navigate('/doctor-dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save article');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    const draftData = { ...article, isPublished: false };
    try {
      if (isEditing) {
        await doctorAPI.updateArticle(id!, draftData);
      } else {
        await doctorAPI.createArticle(draftData);
      }
      setSuccess('Draft saved successfully!');
    } catch (err: any) {
      setError('Failed to save draft');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/doctor-dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Doctor Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isEditing ? 'Edit Article' : 'Create New Article'}
            </h1>
            <p className="text-gray-600">
              Share your medical knowledge and help educate the community about heart health.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Article Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={article.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={article.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="Heart Disease">Heart Disease</option>
                  <option value="Diet">Diet</option>
                  <option value="Exercise">Exercise</option>
                  <option value="Medication">Medication</option>
                  <option value="Prevention">Prevention</option>
                  <option value="Symptoms">Symptoms</option>
                  <option value="Treatment">Treatment</option>
                  <option value="Research">Research</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt *
              </label>
              <textarea
                name="excerpt"
                value={article.excerpt}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Brief summary of your article (appears in article listings)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              {article.content.map((content, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Section {index + 1}</span>
                    {article.content.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeContentSection(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove Section
                      </button>
                    )}
                  </div>
                  <textarea
                    value={content}
                    onChange={(e) => handleContentChange(index, e.target.value)}
                    required
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Write your article content here..."
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addContentSection}
                className="text-red-500 hover:text-red-600 text-sm"
              >
                + Add Content Section
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              {article.tags.map((tag, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                    placeholder="e.g., heart health, prevention, exercise"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  {article.tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addTag}
                className="text-red-500 hover:text-red-600 text-sm"
              >
                + Add Tag
              </button>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isPublished"
                id="isPublished"
                checked={article.isPublished}
                onChange={handleInputChange}
                className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublished" className="ml-2 text-sm text-gray-700">
                Publish immediately (uncheck to save as draft)
              </label>
            </div>

            <div className="flex justify-between items-center pt-6 border-t">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isLoading}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Save Draft
              </button>
              <div className="flex space-x-3">
                <Link
                  to="/doctor-dashboard"
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : (article.isPublished ? 'Publish Article' : 'Save Article')}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorArticleEditorPage;
