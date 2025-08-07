import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Import our components
import Header from './components/Header';
import InputSection from './components/InputSection';
import ChromeStoreSection from './components/ChromeStoreSection';
import PictureSection from './components/PictureSection';
import MapView from './components/MapView';
import AddReviewForm from './components/AddReviewForm';
import AuthCallback from './components/AuthCallback';
import ReviewPage from './components/review/ReviewPage';
import ProfilePage from './components/profile/ProfilePage';
import ModerationPage from './components/admin/ModerationPage';

// Import Providers
import { FormProvider } from './store/FormContext';
import { FormMessagesProvider } from './store/FormMessagesProvider';

function App() {
  const location = useLocation();
  const isGrayPage = location.pathname === '/add-review' || location.pathname.includes('/review/') || location.pathname === '/profile';
  return (
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
                <InputSection />
                <ChromeStoreSection />
                <PictureSection />
              </>
            }
          />
        </Routes>

        {!isGrayPage && (
          <footer className="mx-auto mt-8 max-w-6xl py-6 text-center text-sm text-gray-500">
            <p>
              © {new Date().getFullYear()} Casero Verificado - Todas las opiniones son anónimas
            </p>
          </footer>
        )}
      </div>
    </FormProvider>
  );
}

export default App;
