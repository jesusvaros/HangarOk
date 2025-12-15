import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'react-hot-toast';

// Import our components
import Header from './components/Header';
import PageSEO from './seo/PageSEO';
import HeroSection from './components/HeroSection';
import InputSection from './components/InputSection';
import BenefitsSection from './components/BenefitsSection';
import TrustRewardsSection from './components/TrustRewardsSection';
import ChromeStoreSection from './components/ChromeStoreSection';
import PictureSection from './components/PictureSection';
import HowItWorksSection from './components/HowItWorksSection';
//import LatestReviewsSection from './components/LatestReviewsSection';
import FAQSection from './components/FAQSection';
import AboutSection from './components/AboutSection';
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
              <PageSEO title="Authentication | HangarOK" description="Processing secure authentication." noindex />
              <AuthCallback />
            </>
          } />
          <Route path="/review/:id" element={
            <>
              <PageSEO title="Review | HangarOK" description="Read anonymous reviews from riders about cycle hangars." />
              <ReviewPage />
            </>
          } />
          <Route path="/map" element={
            <>
              <PageSEO title="Hangar Map | HangarOK" description="Explore anonymous reviews of cycle hangars across the UK on our interactive map." />
              <MapView />
            </>
          } />
          <Route path="/opiniones" element={<CityReviewsIndexPage />} />
          <Route path="/opiniones/:citySlug" element={<CityReviewsPage />} />
          {/* <Route path="/blog" element={<BlogListPage />} /> */}
          {/* <Route path="/blog/:slug" element={<BlogPostPage />} /> */}
          <Route path="/profile" element={
            <>
              <PageSEO title="Profile | HangarOK" description="Manage your HangarOK profile." noindex />
              <ProfilePage />
            </>
          } />
          <Route path="/admin/moderate" element={<ModerationPage />} />
          {/* Legal routes */}
          <Route path="/aviso-legal" element={<><PageSEO title="Legal Notice | HangarOK" description="Legal information for HangarOK." /><AvisoLegal /></>} />
          <Route path="/politica-privacidad" element={<><PageSEO title="Privacy Policy | HangarOK" description="How we handle your personal data." /><PoliticaPrivacidad /></>} />
          <Route path="/cookies" element={<><PageSEO title="Cookie Policy | HangarOK" description="Information about cookie usage." /><PoliticaCookies /></>} />
          <Route path="/condiciones-uso" element={<><PageSEO title="Terms of Use | HangarOK" description="Terms and conditions for using HangarOK." /><CondicionesUso /></>} />
          <Route path="/buenas-practicas" element={<><PageSEO title="Best Practices | HangarOK" description="Guidelines for posting responsible reviews." /><BuenasPracticas /></>} />
          <Route path="/terminosycondiciones" element={<><PageSEO title="Terms & Conditions | HangarOK" description="Terms and Conditions for HangarOK." /><LegalHub /></>} />
          <Route path="/terminosCondiciones" element={<><PageSEO title="Terms & Conditions | HangarOK" description="Terms and Conditions for HangarOK." /><LegalHub /></>} />
          <Route
            path="/add-review"
            element={
              <FormMessagesProvider>
                <PageSEO title="Add Review | HangarOK" description="Share an anonymous review about your cycle hangar." noindex />
                <AddReviewForm />
              </FormMessagesProvider>
            }
          />
              <Route
            path="/"
            element={
              <>
                <PageSEO title="HangarOK | UK's peer-to-peer cycle hangar reviews" description="Share and discover anonymous reviews of cycle hangars across the UK. Help improve cycling infrastructure with real rider feedback." />
                <HeroSection />
                <InputSection />
                <HowItWorksSection />
                {/* <StatsSection /> */}
                <BenefitsSection />
                <TrustRewardsSection />
                  <PictureSection />
                <ChromeStoreSection />
                  {/* <LatestReviewsSection /> */}
                  <FAQSection />
                  <AboutSection />
                </>
              }
            />
        </Routes>


        <footer className="mx-auto mt-8 max-w-6xl py-8 text-center text-sm text-gray-600 border-t border-gray-200">
          <nav className="mb-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {/* <Link className="hover:text-gray-700" to="/blog" {...umamiEventProps('footer:blog')}>Blog</Link>
            <span className="text-gray-400">•</span> */}
            <Link className="hover:text-gray-700" to="/opiniones" {...umamiEventProps('footer:reviews')}>Reviews by city or town</Link>
            <span className="text-gray-400">•</span>
            <Link className="hover:text-gray-700" to="/terminosycondiciones" {...umamiEventProps('footer:terms')}>Terms & Conditions</Link>
            <span className="text-gray-400">•</span>
            <Link className="hover:text-gray-700" to="/politica-privacidad" {...umamiEventProps('footer:privacy')}>Privacy Policy</Link>
            <span className="text-gray-400">•</span>
            <Link className="hover:text-gray-700" to="/cookies" {...umamiEventProps('footer:cookies')}>Cookies</Link>
            <span className="text-gray-400">•</span>
            <Link className="hover:text-gray-700" to="/about" {...umamiEventProps('footer:about')}>About</Link>
          </nav>
            <p className="text-xs leading-relaxed max-w-4xl mx-auto">
              © {new Date().getFullYear()} LAGS Consulting Limited (delivering HangarOK). The UK's peer-to-peer cycle hangar review community. Built by riders, for riders. All rights reserved.<br />
              LAGS Consulting Limited (delivering HangarOK) is a registered company in England & Wales Company No. 10042170
            </p>
          </footer>
        </div>
      </FormProvider>
    </AuthProvider>
  );
}

export default App;
