import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GymProvider, useGym } from './context/GymContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Progress from './pages/Progress';
import Statistics from './pages/Statistics';
import Analysis from './pages/Analysis';
import Settings from './pages/Settings';
import ProfileSetup from './pages/ProfileSetup';

const AppLayout = () => {
  const { profile } = useGym();

  if (!profile) {
    return <ProfileSetup />;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#0f1117] text-gray-900 dark:text-[#c9d1d9] overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <GymProvider>
      <Router>
        <AppLayout />
      </Router>
    </GymProvider>
  );
}

export default App;
