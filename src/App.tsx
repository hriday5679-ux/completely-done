import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { SystemDateProvider, useSystemDate } from './context/SystemDateContext.tsx';
import { Header } from './components/Header.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { DateSimulatorModal } from './components/DateSimulatorModal.tsx';
import { NotificationDrawer } from './components/NotificationDrawer.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';

// Public & Authentication Pages
import { LandingPage } from './pages/auth/LandingPage.tsx';
import { LoginPage } from './pages/auth/LoginPage.tsx';
import { RegisterPage } from './pages/auth/RegisterPage.tsx';
import { DemoPage } from './pages/auth/DemoPage.tsx';

// First-Login / Onboarding Pages
import { SelectTypePage } from './pages/onboarding/SelectTypePage.tsx';
import { AicteSelectRolePage } from './pages/onboarding/AicteSelectRolePage.tsx';
import { InstitutionSelectPage } from './pages/onboarding/InstitutionSelectPage.tsx';

// Core Workflow Pages
import { Dashboard } from './pages/Dashboard.tsx';
import { FDRList } from './pages/FDRList.tsx';
import { FDRCreate } from './pages/FDRCreate.tsx';
import { FDRDetail } from './pages/FDRDetail.tsx';
import { Institutions } from './pages/Institutions.tsx';
import { RegisterInstitution } from './pages/RegisterInstitution.tsx';
import { InstitutionProfile } from './pages/InstitutionProfile.tsx';
import { InstitutionVaultPage } from './pages/InstitutionVaultPage.tsx';
import { DocumentVault } from './pages/DocumentVault.tsx';
import { DocumentViewerPage } from './pages/DocumentViewerPage.tsx';
import { ReleaseRequests } from './pages/ReleaseRequests.tsx';
import { ClearanceMatrixPage } from './pages/ClearanceMatrixPage.tsx';
import { MaturityCalendar } from './pages/MaturityCalendar.tsx';
import { PolicyConfigPage } from './pages/PolicyConfigPage.tsx';
import { ReportsPage } from './pages/ReportsPage.tsx';
import { AuditLogPage } from './pages/AuditLogPage.tsx';
import { AdminUsersPage } from './pages/AdminUsersPage.tsx';
import { UserProfilePage } from './pages/UserProfilePage.tsx';
import { SystemSettingsPage } from './pages/SystemSettingsPage.tsx';
import { NotFoundPage } from './pages/NotFoundPage.tsx';
import { PendingApprovalView } from './components/PendingApprovalView.tsx';

import { isInstitutionRole } from './types/index.ts';
import { Building2, RefreshCw, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

const LOADING_STAGES = [
  { label: 'Initializing cryptographic security session', detail: 'Establishing TLS tunnel & auth tokens' },
  { label: 'Verifying statutory credentials & clearance', detail: 'Validating AICTE & Institutional RBAC roles' },
  { label: 'Loading FDR compliance registers & vaults', detail: 'Connecting to centralized Firestore records' },
  { label: 'Synchronizing digital security certificates', detail: 'Preparing 3-Tier clearance matrix' },
];

/**
 * Enhanced loading screen with smooth progress transitions, step indicators,
 * and statutory AICTE portal branding.
 */
interface LoadingScreenProps {
  onBypass?: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onBypass }) => {
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(18);
  const [showBypass, setShowBypass] = useState(false);
  const { enterDemoMode } = useAuth();

  useEffect(() => {
    const t1 = setTimeout(() => {
      setStageIndex(1);
      setProgress(55);
    }, 350);

    const t2 = setTimeout(() => {
      setStageIndex(2);
      setProgress(82);
    }, 750);

    const t3 = setTimeout(() => {
      setStageIndex(3);
      setProgress(98);
    }, 1200);

    const t4 = setTimeout(() => {
      setProgress(100);
      setShowBypass(true);
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const currentStage = LOADING_STAGES[stageIndex] || LOADING_STAGES[0];

  const handleManualContinue = () => {
    if (onBypass) {
      onBypass();
    } else {
      window.location.href = '/login';
    }
  };

  const handleQuickDemo = async () => {
    try {
      await enterDemoMode('INSTITUTION');
    } catch {
      window.location.href = '/demo';
    }
  };

  return (
    <div className="min-h-screen bg-[#07162b] flex flex-col items-center justify-center p-6 text-slate-100 relative overflow-hidden select-none">
      {/* Statutory Tricolor Top Hairline */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-white to-emerald-500 opacity-80" />

      {/* Ambient background glows */}
      <div className="absolute w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -top-24 -left-24" />
      <div className="absolute w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -bottom-24 -right-24" />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center text-center">
        {/* Emblem Badge with glowing halo */}
        <div className="relative mb-6">
          <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 to-blue-600 rounded-3xl blur-md opacity-40 animate-pulse" />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-blue-950 shadow-2xl border border-amber-300/40">
            <Building2 className="w-8 h-8 text-blue-950" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 border-2 border-[#07162b] shadow">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Brand & Heading */}
        <div className="flex items-center justify-center gap-2 mb-1">
          <h1 className="text-2xl font-black tracking-tight text-white">AICTE FDR360</h1>
          <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase">
            SIH26265
          </span>
        </div>
        <p className="text-xs text-slate-400 font-medium tracking-wide mb-6">
          Streamlined Security Deposit & Fixed Deposit Portal
        </p>

        {/* Detailed Progress Card */}
        <div className="w-full bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-2xl">
          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-2 text-slate-300 font-medium truncate max-w-[280px]">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400 shrink-0" />
              <span className="truncate">{progress === 100 ? 'System ready' : currentStage.label}</span>
            </div>
            <span className="font-mono text-xs font-bold text-amber-400 shrink-0">
              {progress}%
            </span>
          </div>

          {/* Smooth Progress Bar with pulse sheen */}
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden relative mb-4 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-500 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/25 animate-pulse" />
            </div>
          </div>

          {/* Stepper indicator dots */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800/80">
            {LOADING_STAGES.map((stage, idx) => {
              const isDone = stageIndex > idx || progress === 100;
              const isCurrent = stageIndex === idx && progress < 100;
              return (
                <div key={idx} className="flex flex-col items-center text-center">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-500 mb-1 ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : isCurrent
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50 ring-2 ring-amber-400/20'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>
                  <span
                    className={`text-[9px] line-clamp-1 transition-colors duration-300 ${
                      isCurrent
                        ? 'text-slate-200 font-semibold'
                        : isDone
                        ? 'text-slate-400'
                        : 'text-slate-600'
                    }`}
                  >
                    Step {idx + 1}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Stage micro-detail banner */}
          <div className="mt-3 py-1.5 px-3 rounded-lg bg-slate-950/60 border border-slate-800/60 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span className="font-mono text-[10.5px]">
              {progress === 100 ? 'Verification complete. Entering portal...' : currentStage.detail}
            </span>
          </div>

          {/* Direct Emergency Bypass Buttons if waiting */}
          {showBypass && (
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row gap-2 justify-center animate-fadeIn">
              <button
                type="button"
                onClick={handleManualContinue}
                className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md active:scale-95"
              >
                Proceed to Login →
              </button>
              <button
                type="button"
                onClick={handleQuickDemo}
                className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-lg border border-slate-700 transition-all active:scale-95"
              >
                Launch Demo Mode
              </button>
            </div>
          )}
        </div>

        {/* Security badge footer */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <Lock className="w-3 h-3 text-slate-400" />
          <span>256-Bit Encrypted Session</span>
          <span className="text-slate-700">•</span>
          <span>Official AICTE Statutory Portal</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Main Layout for Authenticated Pages
 */
interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  const { user, isDemoMode } = useAuth();
  const { refreshTrigger } = useSystemDate();
  const navigate = useNavigate();

  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Fetch unread count for badge
  useEffect(() => {
    if (user || isDemoMode) {
      fetch('/api/notifications')
        .then(res => res.json())
        .then(data => {
          setUnreadCount(data.unreadCount || 0);
        })
        .catch(() => {});
    }
  }, [refreshTrigger, user, isDemoMode]);

  const handleNotificationLink = (linkType: string, linkId: string) => {
    if (linkType === 'FDR') {
      navigate(`/fdr/${linkId}`);
    } else if (linkType === 'RELEASE') {
      navigate(`/release?selectId=${linkId}`);
    } else if (linkType === 'INSTITUTION') {
      navigate(`/institution/${linkId}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-900 selection:text-white">
      {/* Top Header */}
      <Header
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadNotificationsCount={unreadCount}
        onToggleSidebarMobile={() => setMobileSidebarOpen(prev => !prev)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Navigation Sidebar */}
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Date Simulator Modal */}
      <DateSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
      />

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onSelectLink={handleNotificationLink}
      />
    </div>
  );
};

/**
 * Route protection wrapper:
 * - Unauthenticated -> redirect to /login
 * - Incomplete profile -> redirect to /select-type
 * - Pending AICTE user -> PendingApprovalView
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isDemoMode } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen />;

  if (!user && !isDemoMode) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Profile incomplete flow
  if (!isDemoMode && user && user.onboardingComplete === false) {
    return <Navigate to="/select-type" replace />;
  }

  // Pending AICTE user view (awaiting portal admin approval)
  if (!isDemoMode && user && user.accountType === 'AICTE' && user.accountStatus === 'PENDING') {
    return <PendingApprovalView />;
  }

  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
};

/**
 * Onboarding Route Protection:
 * - Must be authenticated
 * - If profile already complete, redirect to destination
 */
const OnboardingRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isDemoMode } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!user && !isDemoMode) {
    return <Navigate to="/login" replace />;
  }

  // If already onboarded, forward to default destination
  if (!isDemoMode && user && user.onboardingComplete) {
    const isInst = isInstitutionRole(user?.role);
    const destination = isInst ? `/institution/${user?.institutionId || 'inst-01'}` : '/dashboard';
    return <Navigate to={destination} replace />;
  }

  return <>{children}</>;
};

/**
 * Public Only Route (for /login and /register)
 * - If already logged in and profile complete, redirects to user's landing page
 */
const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isDemoMode } = useAuth();

  if (loading) return <LoadingScreen />;

  // Only redirect away from login/register if an active user profile exists and onboarding is complete
  if (user && user.onboardingComplete) {
    const isInst = isInstitutionRole(user?.role);
    const dest = isInst ? `/institution/${user?.institutionId || 'inst-01'}` : '/dashboard';
    return <Navigate to={dest} replace />;
  }

  return <>{children}</>;
};

/**
 * Root Route Handler ('/')
 */
const RootHandler: React.FC = () => {
  const { user, loading, isDemoMode } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!user && !isDemoMode) {
    return <Navigate to="/login" replace />;
  }

  if (!isDemoMode && user && user.onboardingComplete === false) {
    return <Navigate to="/select-type" replace />;
  }

  const isInst = isInstitutionRole(user?.role);
  const dest = isInst ? `/institution/${user?.institutionId || 'inst-01'}` : '/dashboard';
  return <Navigate to={dest} replace />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1. Root: Dynamic Router (routes to /login if unauthenticated, or dashboard/institution if authenticated) */}
      <Route path="/" element={<RootHandler />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/overview" element={<LandingPage />} />

      {/* 2. Authentication Routes */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />
      <Route path="/demo" element={<DemoPage />} />

      {/* 3. First-Login Selection Flow */}
      <Route
        path="/select-type"
        element={
          <OnboardingRoute>
            <SelectTypePage />
          </OnboardingRoute>
        }
      />
      <Route
        path="/aicte/select-role"
        element={
          <OnboardingRoute>
            <AicteSelectRolePage />
          </OnboardingRoute>
        }
      />
      <Route
        path="/institution/select"
        element={
          <OnboardingRoute>
            <InstitutionSelectPage />
          </OnboardingRoute>
        }
      />

      {/* 4. Core Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/institution/:id"
        element={
          <ProtectedRoute>
            <InstitutionProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/institution/:id/vault"
        element={
          <ProtectedRoute>
            <InstitutionVaultPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/fdr/:fdrId"
        element={
          <ProtectedRoute>
            <FDRDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <DocumentVault />
          </ProtectedRoute>
        }
      />
      <Route
        path="/documents/:docId"
        element={
          <ProtectedRoute>
            <DocumentViewerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/audit-log"
        element={
          <ProtectedRoute>
            <AuditLogPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <AdminUsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserProfilePage />
          </ProtectedRoute>
        }
      />

      {/* 5. Additional Workflow Routes */}
      <Route
        path="/fdrs"
        element={
          <ProtectedRoute>
            <FDRList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/fdrs/new"
        element={
          <ProtectedRoute>
            <FDRCreate />
          </ProtectedRoute>
        }
      />
      <Route
        path="/institutions"
        element={
          <ProtectedRoute>
            <Institutions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/institutions/new"
        element={
          <ProtectedRoute>
            <RegisterInstitution />
          </ProtectedRoute>
        }
      />
      <Route
        path="/release"
        element={
          <ProtectedRoute>
            <ReleaseRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clearances"
        element={
          <ProtectedRoute>
            <ClearanceMatrixPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/maturity"
        element={
          <ProtectedRoute>
            <MaturityCalendar />
          </ProtectedRoute>
        }
      />
      <Route
        path="/policy"
        element={
          <ProtectedRoute>
            <PolicyConfigPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/system"
        element={
          <ProtectedRoute>
            <SystemSettingsPage />
          </ProtectedRoute>
        }
      />

      {/* Aliases for backwards compatibility */}
      <Route path="/vault" element={<Navigate to="/documents" replace />} />
      <Route path="/audit" element={<Navigate to="/audit-log" replace />} />
      <Route path="/admin/access-requests" element={<Navigate to="/admin/users" replace />} />
      <Route path="/admin/policy" element={<Navigate to="/policy" replace />} />

      {/* 6. 404 Not Found Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SystemDateProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </SystemDateProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
