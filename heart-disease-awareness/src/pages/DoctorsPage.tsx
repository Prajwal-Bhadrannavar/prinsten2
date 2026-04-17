import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Phone, Star, Clock, Search, ArrowLeft } from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  distance: string;
  rating: number;
  availability: string;
  phone: string;
  address: string;
  conditions: string[];
}

const DoctorsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  const doctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      hospital: 'Heart Care Medical Center',
      distance: '2.3 miles',
      rating: 4.8,
      availability: 'Available Today',
      phone: '(555) 123-4567',
      address: '123 Medical Blvd, Suite 100',
      conditions: ['Heart Disease', 'Hypertension', 'Arrhythmia']
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialty: 'Interventional Cardiologist',
      hospital: 'Regional Heart Institute',
      distance: '3.7 miles',
      rating: 4.9,
      availability: 'Tomorrow',
      phone: '(555) 234-5678',
      address: '456 Cardiology Drive, Suite 200',
      conditions: ['Coronary Artery Disease', 'Heart Attack Recovery', 'Stent Procedures']
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      specialty: 'Electrophysiologist',
      hospital: 'Advanced Heart Center',
      distance: '4.1 miles',
      rating: 4.7,
      availability: 'This Week',
      phone: '(555) 345-6789',
      address: '789 Rhythm Street, Suite 300',
      conditions: ['Arrhythmia', 'Pacemaker', 'Atrial Fibrillation']
    },
    {
      id: '4',
      name: 'Dr. James Wilson',
      specialty: 'Cardiologist',
      hospital: 'Community Heart Hospital',
      distance: '5.2 miles',
      rating: 4.6,
      availability: 'Next Week',
      phone: '(555) 456-7890',
      address: '321 Community Lane, Suite 150',
      conditions: ['Heart Failure', 'Preventive Cardiology', 'Hypertension']
    },
    {
      id: '5',
      name: 'Dr. Lisa Thompson',
      specialty: 'Pediatric Cardiologist',
      hospital: 'Children\'s Heart Center',
      distance: '6.8 miles',
      rating: 4.9,
      availability: 'Available Today',
      phone: '(555) 567-8901',
      address: '654 Kids Way, Suite 100',
      conditions: ['Congenital Heart Disease', 'Pediatric Heart Conditions']
    },
    {
      id: '6',
      name: 'Dr. Robert Martinez',
      specialty: 'Cardiac Surgeon',
      hospital: 'Surgical Heart Institute',
      distance: '7.4 miles',
      rating: 4.8,
      availability: 'This Week',
      phone: '(555) 678-9012',
      address: '987 Surgery Road, Suite 400',
      conditions: ['Bypass Surgery', 'Valve Replacement', 'Heart Transplant']
    }
  ];

  const specialties = ['All', 'Cardiologist', 'Interventional Cardiologist', 'Electrophysiologist', 'Pediatric Cardiologist', 'Cardiac Surgeon'];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.conditions.some(condition => condition.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSpecialty = selectedSpecialty === 'All' || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const getAvailabilityColor = (availability: string) => {
    if (availability === 'Available Today') return 'text-green-600 bg-green-100';
    if (availability === 'Tomorrow') return 'text-blue-600 bg-blue-100';
    return 'text-gray-600 bg-gray-100';
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-200 text-yellow-400" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <Heart className="h-8 w-8 text-red-500 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">Find Heart Specialists</h1>
              </Link>
            </div>
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-1 inline" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Find Qualified Heart Specialists Near You
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with experienced cardiologists and heart specialists in your area for expert cardiac care.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, hospital, or condition..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {specialties.map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Found {filteredDoctors.length} doctors matching your criteria
          </div>
        </div>

        {/* Emergency Notice */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <Heart className="h-6 w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-800 mb-1">Medical Emergency?</h3>
              <p className="text-red-700 text-sm">
                If you are experiencing a medical emergency, call 112 (general) or 108 (medical) immediately or go to the nearest emergency room.
                This directory is for non-emergency appointments and consultations.
              </p>
            </div>
          </div>
        </div>

        {/* Doctors List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDoctors.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{doctor.name}</h3>
                    <p className="text-red-600 font-medium">{doctor.specialty}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center mb-1">
                      {renderStars(doctor.rating)}
                    </div>
                    <div className="text-sm text-gray-600">{doctor.rating}</div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{doctor.hospital}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{doctor.distance} away</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span className="text-sm">{doctor.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{doctor.address}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Availability:</span>
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(doctor.availability)}`}>
                    {doctor.availability}
                  </span>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Specializes in:</h4>
                  <div className="flex flex-wrap gap-2">
                    {doctor.conditions.map((condition, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <a
                    href={`tel:${doctor.phone}`}
                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg text-center hover:bg-red-600 transition-colors"
                  >
                    Call Now
                  </a>
                  <button className="flex-1 border border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors">
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or filters to find available specialists.
            </p>
          </div>
        )}

        {/* Information Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">When to See a Cardiologist</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Schedule an appointment if you experience:</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">·</span>
                  Chest pain or discomfort
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">·</span>
                  Shortness of breath
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">·</span>
                  Heart palpitations or irregular heartbeat
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">·</span>
                  High blood pressure
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">·</span>
                  Family history of heart disease
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Regular check-ups recommended for:</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">·</span>
                  Adults over 40 years old
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">·</span>
                  People with diabetes
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">·</span>
                  Individuals with high cholesterol
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">·</span>
                  Current or former smokers
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">·</span>
                  Overweight or obese individuals
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <Heart className="h-6 w-6 text-yellow-600 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Important Information</h4>
              <p className="text-yellow-700 text-sm">
                This is a directory of healthcare providers and not a substitute for professional medical advice. 
                Always verify credentials, insurance acceptance, and availability directly with the healthcare provider. 
                In case of emergency, call 112 (general) or 108 (medical) or visit your nearest emergency department.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorsPage;
