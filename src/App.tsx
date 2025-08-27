import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Import our components
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import InputSection from './components/InputSection';
import BenefitsSection from './components/BenefitsSection';
import ChromeStoreSection from './components/ChromeStoreSection';
import PictureSection from './components/PictureSection';
import HowItWorksSection from './components/HowItWorksSection';
//import LatestReviewsSection from './components/LatestReviewsSection';
import FAQSection from './components/FAQSection';
import FinalCTASection from './components/FinalCTASection';
import MapView from './components/MapView';
import AddReviewForm from './components/AddReviewForm';
import AuthCallback from './components/AuthCallback';
import ReviewPage from './components/review/ReviewPage';
import ProfilePage from './components/profile/ProfilePage';
import ModerationPage from './components/admin/ModerationPage';
// Legal pages
import LegalHub from './pages/LegalHub';
import AvisoLegal from './pages/AvisoLegal';
import PoliticaPrivacidad from './pages/PoliticaPrivacidad';
import PoliticaCookies from './pages/PoliticaCookies';
import CondicionesUso from './pages/CondicionesUso';
import BuenasPracticas from './pages/BuenasPracticas';

// Import Providers
import { FormProvider } from './store/FormContext';
import { FormMessagesProvider } from './store/FormMessagesProvider';
import { AuthProvider } from './store/auth';

function App() {
  const location = useLocation();
  const isGrayPage = location.pathname === '/add-review' || location.pathname.includes('/review/') || location.pathname === '/profile' || location.pathname === '/map';
  return (
    <AuthProvider>
      <FormProvider>
        <div className={`min-h-screen ${isGrayPage ? 'bg-gray-100' : 'bg-white'}`}>
        <Toaster
          position="bottom-left"
          gutter={8}
          toastOptions={{
            duration: 5000,
            style: {
              background: '#fff',
              color: '#363636',
            },
          }}
        />
        <Header />

        <Routes>
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/review/:id" element={<ReviewPage />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin/moderate" element={<ModerationPage />} />
          {/* Legal routes */}
          <Route path="/aviso-legal" element={<AvisoLegal />} />
          <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
          <Route path="/cookies" element={<PoliticaCookies />} />
          <Route path="/condiciones-uso" element={<CondicionesUso />} />
          <Route path="/buenas-practicas" element={<BuenasPracticas />} />
          <Route path="/terminosycondiciones" element={<LegalHub />} />
          <Route path="/terminosCondiciones" element={<LegalHub />} />
          <Route
            path="/add-review"
            element={
              <FormMessagesProvider>
                <AddReviewForm />
              </FormMessagesProvider>
            }
          />
              <Route
            path="/"
            element={
              <>
                <HeroSection />
                <InputSection />
                <HowItWorksSection />
                {/* <StatsSection /> */}
                <BenefitsSection />
                <ChromeStoreSection />
                  <PictureSection />
                  {/* <LatestReviewsSection /> */}
                  <FAQSection />
                </>
              }
            />
        </Routes>

        <FinalCTASection />

        <footer className="mx-auto mt-8 max-w-6xl py-6 text-center text-sm text-gray-500">
          <nav className="mb-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link className="hover:text-gray-700" to="/terminosycondiciones">Términos y Condiciones</Link>
            <span className="text-gray-400">•</span>
            <Link className="hover:text-gray-700" to="/aviso-legal">Aviso Legal</Link>
            <span className="text-gray-400">•</span>
            <Link className="hover:text-gray-700" to="/politica-privacidad">Política de Privacidad</Link>
            <span className="text-gray-400">•</span>
            <Link className="hover:text-gray-700" to="/cookies">Política de Cookies</Link>
            <span className="text-gray-400">•</span>
            <Link className="hover:text-gray-700" to="/condiciones-uso">Condiciones de Uso</Link>
            <span className="text-gray-400">•</span>
            <Link className="hover:text-gray-700" to="/buenas-practicas">Buenas Prácticas</Link>
          </nav>
            <p>
              © {new Date().getFullYear()} Casero Verificado - Todas las opiniones son anónimas y reflejan experiencias
              personales, no declaraciones de hechos ni asesoramiento legal.
            </p>
          </footer>
        </div>
      </FormProvider>
    </AuthProvider>
  );
}

export default App;
