import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'react-hot-toast';

// Import our components
import Header from './components/Header';
import PageSEO from './seo/PageSEO';
import HeroSection from './components/HeroSection';
import InputSection from './components/InputSection';
import BenefitsSection from './components/BenefitsSection';
import ChromeStoreSection from './components/ChromeStoreSection';
import PictureSection from './components/PictureSection';
import HowItWorksSection from './components/HowItWorksSection';
//import LatestReviewsSection from './components/LatestReviewsSection';
import FAQSection from './components/FAQSection';
import MapView from './components/MapView';
import AddReviewForm from './components/AddReviewForm';
import AuthCallback from './components/AuthCallback';
import ReviewPage from './components/review/ReviewPage';
import ProfilePage from './components/profile/ProfilePage';
import ModerationPage from './components/admin/ModerationPage';
// import BlogListPage from './components/blog/BlogListPage';
// import BlogPostPage from './components/blog/BlogPostPage';
// Legal pages
import LegalHub from './pages/LegalHub';
import AvisoLegal from './pages/AvisoLegal';
import PoliticaPrivacidad from './pages/PoliticaPrivacidad';
import PoliticaCookies from './pages/PoliticaCookies';
import CondicionesUso from './pages/CondicionesUso';
import BuenasPracticas from './pages/BuenasPracticas';
import CityReviewsIndexPage from './pages/CityReviewsIndexPage';
import CityReviewsPage from './pages/CityReviewsPage';
import UmamiTracker from './components/analytics/UmamiTracker';

// Import Providers
import { FormProvider } from './store/FormContext';
import { FormMessagesProvider } from './store/FormMessagesProvider';
import { AuthProvider } from './store/auth';
import { umamiEventProps } from './utils/analytics';

function App() {
  const location = useLocation();
  const isGrayPage = location.pathname === '/add-review' || location.pathname.includes('/review/') || location.pathname === '/profile' || location.pathname === '/map';

  return (
    <AuthProvider>
      <FormProvider>
        <div className={`min-h-screen ${isGrayPage ? 'bg-gray-100' : 'bg-white'}`}>
        {/* Vercel Analytics */}
        <Analytics />
        <UmamiTracker />
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
          <Route path="/auth/callback" element={
            <>
              <PageSEO title="Autenticación | CaseroOk" description="Procesando autenticación segura." noindex />
              <AuthCallback />
            </>
          } />
          <Route path="/review/:id" element={
            <>
              <PageSEO title="Opinión | CaseroOk" description="Lee opiniones anónimas de inquilinos sobre viviendas y caseros." />
              <ReviewPage />
            </>
          } />
          <Route path="/map" element={
            <>
              <PageSEO title="Mapa de Opiniones | CaseroOk" description="Explora en el mapa las opiniones anónimas sobre viviendas y caseros." />
              <MapView />
            </>
          } />
          <Route path="/opiniones" element={<CityReviewsIndexPage />} />
          <Route path="/opiniones/:citySlug" element={<CityReviewsPage />} />
          {/* <Route path="/blog" element={<BlogListPage />} /> */}
          {/* <Route path="/blog/:slug" element={<BlogPostPage />} /> */}
          <Route path="/profile" element={
            <>
              <PageSEO title="Perfil | CaseroOk" description="Gestiona tu perfil en CaseroOk." noindex />
              <ProfilePage />
            </>
          } />
          <Route path="/admin/moderate" element={<ModerationPage />} />
          {/* Legal routes */}
          <Route path="/aviso-legal" element={<><PageSEO title="Aviso Legal | CaseroOk" description="Información legal de CaseroOk." /><AvisoLegal /></>} />
          <Route path="/politica-privacidad" element={<><PageSEO title="Política de Privacidad | CaseroOk" description="Cómo tratamos tus datos personales." /><PoliticaPrivacidad /></>} />
          <Route path="/cookies" element={<><PageSEO title="Política de Cookies | CaseroOk" description="Información sobre el uso de cookies." /><PoliticaCookies /></>} />
          <Route path="/condiciones-uso" element={<><PageSEO title="Condiciones de Uso | CaseroOk" description="Términos y condiciones de uso de CaseroOk." /><CondicionesUso /></>} />
          <Route path="/buenas-practicas" element={<><PageSEO title="Buenas Prácticas | CaseroOk" description="Recomendaciones para publicar opiniones responsables." /><BuenasPracticas /></>} />
          <Route path="/terminosycondiciones" element={<><PageSEO title="Términos y Condiciones | CaseroOk" description="Términos y Condiciones de CaseroOk." /><LegalHub /></>} />
          <Route path="/terminosCondiciones" element={<><PageSEO title="Términos y Condiciones | CaseroOk" description="Términos y Condiciones de CaseroOk." /><LegalHub /></>} />
          <Route
            path="/add-review"
            element={
              <FormMessagesProvider>
                <PageSEO title="Añadir Opinión | CaseroOk" description="Comparte una opinión anónima sobre tu vivienda o casero." noindex />
                <AddReviewForm />
              </FormMessagesProvider>
            }
          />
              <Route
            path="/"
            element={
              <>
                <PageSEO title="CaseroOk — Opiniones anónimas sobre viviendas y caseros" description="Descubre y comparte opiniones anónimas sobre viviendas y caseros en España." />
                <HeroSection />
                <InputSection />
                <HowItWorksSection />
                {/* <StatsSection /> */}
                <BenefitsSection />
                  <PictureSection />
                <ChromeStoreSection />
                  {/* <LatestReviewsSection /> */}
                  <FAQSection />
                </>
              }
            />
        </Routes>


        <footer className="mx-auto mt-8 max-w-6xl py-6 text-center text-sm text-gray-500">
          <nav className="mb-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {/* <Link className="hover:text-gray-700" to="/blog" {...umamiEventProps('footer:blog')}>Blog</Link>
            <span className="text-gray-400">•</span> */}
            <Link className="hover:text-gray-700" to="/opiniones" {...umamiEventProps('footer:opiniones')}>Opiniones por ciudad</Link>
            <span className="text-gray-400">•</span>
            <Link className="hover:text-gray-700" to="/terminosycondiciones" {...umamiEventProps('footer:terminos-condiciones')}>Términos y Condiciones</Link>
            <span className="text-gray-400">•</span>
            <Link className="hover:text-gray-700" to="/aviso-legal" {...umamiEventProps('footer:aviso-legal')}>Aviso Legal</Link>
            <span className="text-gray-400">•</span>
            <Link className="hover:text-gray-700" to="/politica-privacidad" {...umamiEventProps('footer:privacidad')}>Política de Privacidad</Link>
            <span className="text-gray-400">•</span>
            <Link className="hover:text-gray-700" to="/cookies" {...umamiEventProps('footer:cookies')}>Política de Cookies</Link>
            <span className="text-gray-400">•</span>
            <Link className="hover:text-gray-700" to="/condiciones-uso" {...umamiEventProps('footer:condiciones-uso')}>Condiciones de Uso</Link>
            <span className="text-gray-400">•</span>
            <Link className="hover:text-gray-700" to="/buenas-practicas" {...umamiEventProps('footer:buenas-practicas')}>Buenas Prácticas</Link>
          </nav>
            <p>
              © {new Date().getFullYear()} CaseroOk - Todas las opiniones son anónimas y reflejan experiencias
              personales, no declaraciones de hechos ni asesoramiento legal.
            </p>
          </footer>
        </div>
      </FormProvider>
    </AuthProvider>
  );
}

export default App;
