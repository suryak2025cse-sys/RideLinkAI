import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import SOSModal from './components/SOSModal';
import SafetyCheckModal from './components/SafetyCheckModal';
import ChatDrawer from './components/ChatDrawer';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PassengerDashboard from './pages/PassengerDashboard';
import DriverDashboard from './pages/DriverDashboard';
import RideTrackingPage from './pages/RideTrackingPage';
import ProfileVerificationPage from './pages/ProfileVerificationPage';
import WomenSafetyPage from './pages/WomenSafetyPage';
import CommunityModesPage from './pages/CommunityModesPage';
import CarbonDashboardPage from './pages/CarbonDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

export default function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <Navbar />

        <main className="flex-1">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected Passenger Routes */}
              <Route 
                path="/passenger" 
                element={
                  <ProtectedRoute>
                    <PassengerDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Protected Driver Routes */}
              <Route 
                path="/driver" 
                element={
                  <ProtectedRoute>
                    <DriverDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Protected App Features */}
              <Route 
                path="/tracking" 
                element={
                  <ProtectedRoute>
                    <RideTrackingPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfileVerificationPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/women-safety" 
                element={
                  <ProtectedRoute>
                    <WomenSafetyPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/community-modes" 
                element={
                  <ProtectedRoute>
                    <CommunityModesPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/carbon-impact" 
                element={
                  <ProtectedRoute>
                    <CarbonDashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={['Admin', 'CampusAdmin']}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                } 
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ErrorBoundary>
        </main>

        {/* Global Modals & Drawers */}
        <SOSModal />
        <SafetyCheckModal />
        <ChatDrawer />

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white py-8 px-4 text-center text-sm text-slate-500 mt-12">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 RideLink AI. AI-Powered Community Last-Mile Mobility Ecosystem.</p>
            <div className="flex gap-4 font-semibold text-slate-600 text-xs">
              <span>Terms of Service</span>
              <span>Safety Policy</span>
              <span>Privacy Portal</span>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
