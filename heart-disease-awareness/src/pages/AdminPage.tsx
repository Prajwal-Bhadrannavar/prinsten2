import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, CheckCircle, XCircle, Eye, Clock, User, Mail, Phone, MapPin, Award, FileText, Trash } from 'lucide-react';
import { adminAPI } from '../services/api';

interface Doctor {
  _id: string;
  userId: {
    _id: string;
    username: string;
    email: string;
  };
  name: string;
  specialty: string;
  licenseNumber: string;
  hospital: string;
  phone: string;
  email: string;
  address: string;
  qualifications: string[];
  experience: number;
  verificationDocuments: string[];
  isVerified: boolean;
  createdAt: string;
}

const AdminPage: React.FC = () => {
  const [pendingDoctors, setPendingDoctors] = useState<Doctor[]>([]);
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchDoctors = useCallback(async () => {
    try {
      if (activeTab === 'pending') {
        const pending = await adminAPI.getPendingVerifications();
        setPendingDoctors(pending);
      } else {
        const all = await adminAPI.getAllDoctors();
        setAllDoctors(all);
      }
    } catch (err: any) {
      setError('Failed to fetch doctors');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleApprove = async (doctorId: string) => {
    try {
      await adminAPI.approveDoctor(doctorId);
      setSuccess('Doctor approved successfully!');
      fetchDoctors();
    } catch (err: any) {
      setError('Failed to approve doctor');
    }
  };

  const handleReject = async (doctorId: string, reason?: string) => {
    const rejectionReason = reason || prompt('Please provide a reason for rejection (optional):') || undefined;
    
    try {
      await adminAPI.rejectDoctor(doctorId, rejectionReason);
      setSuccess('Doctor verification rejected!');
      fetchDoctors();
    } catch (err: any) {
      setError('Failed to reject doctor');
    }
  };

  const handleDelete = async (doctorId: string) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this doctor? This action cannot be undone and will also delete the associated user account.');
    
    if (!isConfirmed) return;
    
    try {
      await adminAPI.deleteDoctor(doctorId);
      setSuccess('Doctor deleted successfully!');
      fetchDoctors();
      if (selectedDoctor && selectedDoctor._id === doctorId) {
        setSelectedDoctor(null);
      }
    } catch (err: any) {
      setError('Failed to delete doctor');
    }
  };

  const viewDoctorDetails = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
  };

  const currentDoctors = activeTab === 'pending' ? pendingDoctors : allDoctors;

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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Verification Portal</h1>
            <p className="text-gray-600">
              Review and manage doctor verification requests
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

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pending'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pending Verifications ({pendingDoctors.length})
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'all'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Doctors ({allDoctors.length})
              </button>
            </nav>
          </div>

          {/* Doctors List */}
          <div className="space-y-4">
            {currentDoctors.length === 0 ? (
              <div className="text-center py-12">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {activeTab === 'pending' ? 'No Pending Verifications' : 'No Doctors Found'}
                </h3>
                <p className="text-gray-600">
                  {activeTab === 'pending' 
                    ? 'All doctor verification requests have been processed.'
                    : 'No doctors have registered yet.'
                  }
                </p>
              </div>
            ) : (
              currentDoctors.map((doctor) => (
                <div key={doctor._id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Dr. {doctor.name}
                      </h3>
                      <p className="text-gray-600">{doctor.specialty}</p>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        Applied {new Date(doctor.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {doctor.isVerified ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Award className="h-4 w-4 mr-2 text-gray-400" />
                      {doctor.licenseNumber}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      {doctor.hospital}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      {doctor.phone}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => viewDoctorDetails(doctor)}
                      className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </button>
                    
                    <div className="flex space-x-2">
                      {!doctor.isVerified && (
                        <>
                          <button
                            onClick={() => handleApprove(doctor._id)}
                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center text-sm"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(doctor._id)}
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors flex items-center text-sm"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(doctor._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center text-sm"
                        title="Delete Doctor"
                      >
                        <Trash className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Doctor Details Modal */}
        {selectedDoctor && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Dr. {selectedDoctor.name}
                  </h3>
                  <button
                    onClick={() => setSelectedDoctor(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Personal Information</h4>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          {selectedDoctor.userId.username}
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          {selectedDoctor.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          {selectedDoctor.phone}
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          {selectedDoctor.address}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Professional Information</h4>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Specialty:</span> {selectedDoctor.specialty}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Hospital:</span> {selectedDoctor.hospital}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">License:</span> {selectedDoctor.licenseNumber}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Experience:</span> {selectedDoctor.experience} years
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Qualifications</h4>
                    <div className="space-y-1">
                      {selectedDoctor.qualifications.map((qual, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          {qual}
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedDoctor.verificationDocuments.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Verification Documents</h4>
                      <div className="space-y-1">
                        {selectedDoctor.verificationDocuments.map((doc, index) => (
                          <div key={index} className="text-sm text-gray-600 flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            {doc}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    {!selectedDoctor.isVerified && (
                      <>
                        <button
                          onClick={() => {
                            handleReject(selectedDoctor._id);
                            setSelectedDoctor(null);
                          }}
                          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => {
                            handleApprove(selectedDoctor._id);
                            setSelectedDoctor(null);
                          }}
                          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                        >
                          Approve
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        handleDelete(selectedDoctor._id);
                        setSelectedDoctor(null);
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center"
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete Doctor
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
