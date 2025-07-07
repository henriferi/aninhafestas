import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import ServicesSection from './components/ServicesSection';
import CustomBudgetSection from './components/CustomBudgetSection';
import FacilitiesSection from './components/FacilitiesSection';
import Footer from './components/Footer';
import ToastContainer from './components/ui/ToastContainer';
import { useToast } from './hooks/useToast';

import AdminApp from './pages/admin/AdminApp';

function App() {
  const { toasts, removeToast } = useToast();

  return (
    <Router>
      <Routes>
        {/* PÁGINA PÚBLICA */}
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-white">
              <Header />
              <HeroSlider />
              <ServicesSection />
              <CustomBudgetSection />
              <FacilitiesSection />
              <Footer />
              <ToastContainer toasts={toasts} onRemove={removeToast} />
            </div>
          }
        />

        {/* ÁREA ADMIN: login, dashboard, etc. controladas por AdminApp */}
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    </Router>
  );
}

export default App;