import { Login } from './pages/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  Outlet,
  useLocation,
} from "react-router-dom";
import { RoleSelection } from "./pages/RoleSelection";
import { ScenarioOverview } from "./pages/ScenarioOverview";
import { CompanyDetails } from "./pages/CompanyDetails";
import { DemoOverview } from "./pages/DemoOverview";
import { StartTraining } from "./pages/StartTraining";
import { VideoPresentation } from "./pages/VideoPresentation";
import { Toaster } from "./components/ui/toaster";
import { ToastProvider } from "./components/ui/toast";
import { BackToHome } from "./components/BackToHome";
import { TrainingJourney } from "./pages/TrainingJourney";
import { Leaderboard } from "./pages/Leaderboard";
import { Playground } from './pages/Playground';
import { CourseComplete } from './pages/CourseComplete';
import { CompanyOverviewModal } from './components/CompanyOverviewModal';
import { CompanyOrgChartModal } from './components/CompanyOrgChartModal';
import { FeedbackModal } from './components/FeedbackModal';
import { FeedbackProvider } from './contexts/FeedbackContext';

function Root() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}

function AppLayout() {

  if (useLocation().pathname === '/login' || useAuth().loading) {
    return (
      <div className="min-h-screen bg-[#a3dff7]">
        <div className="relative min-h-screen w-screen flex items-center justify-center p-4">
            <Outlet />
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#a3dff7]">
        <div className="relative min-h-screen w-screen flex items-center justify-center p-4">
          <BackToHome />
          <CompanyOverviewModal />
          <CompanyOrgChartModal />
          <FeedbackModal />
          <div className="w-[1440px] h-[900px] bg-white/[0.97] rounded-3xl shadow-2xl backdrop-blur-sm overflow-hidden">
            <Outlet />
          </div>
        </div>
        <Toaster />
      </div>
    </ToastProvider>
  );
}

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <Navigate
        to={`/login?redirectTo=${encodeURIComponent(location.pathname + location.search)}`}
        replace
      />
    );
  }

  return <>{children}</>;
}

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Root />,
      children: [
        {
          element: <ProtectedRoute><Outlet /></ProtectedRoute>,
          children: [
            { index: true, element: <Navigate to="/role" /> },
            { path: "role", element: <RoleSelection /> },
            { path: "scenario", element: <ScenarioOverview /> },
            { path: "company", element: <CompanyDetails /> },
            { path: "overview", element: <DemoOverview /> },
            { path: "training", element: <StartTraining /> },
            { path: "video", element: <VideoPresentation /> },
            { path: "training-journey", element: <TrainingJourney /> },
            { path: "leaderboard", element: <Leaderboard /> },
            { path: "course-complete", element: <CourseComplete /> },
            { path: "playground", element: <Playground /> },
          ],
        },
        { path: "login", element: <Login /> },
      ],
    },
  ],
  {
    future: {
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      v7_startTransition: true as boolean,
    },
  }
);

function App() {
  return (
    <AuthProvider>
      <FeedbackProvider>
        <RouterProvider router={router} />
      </FeedbackProvider>
    </AuthProvider>
  );
}

export default App;
