import { Routes, Route, useLocation } from 'react-router-dom';

// Import our components
import Header from './components/Header';
import InputSection from './components/InputSection';
import ChromeStoreSection from './components/ChromeStoreSection';
import PictureSection from './components/PictureSection';
import MapView from './components/MapView';
import AddReviewForm from './components/AddReviewForm';

// Import FormProvider
import { FormProvider } from './store/FormContext';

function App() {
  const location = useLocation();
  const isAddReviewPage = location.pathname === '/add-review';
  
  return (
    <FormProvider>
      <div className={`min-h-screen ${isAddReviewPage ? 'bg-gray-100' : 'bg-white'}`}>
        <Header />

        <Routes>
          <Route path="/map" element={<MapView />} />
          <Route path="/add-review" element={<AddReviewForm />} />
          <Route path="/" element={
            <>
              <InputSection />
              <ChromeStoreSection />
              <PictureSection />
            </>
          } />
        </Routes>

        {!isAddReviewPage && (
          <footer className="max-w-6xl mx-auto mt-8 text-center text-gray-500 text-sm py-6">
            <p>© {new Date().getFullYear()} Casero Verificado - Todas las opiniones son anónimas</p>
          </footer>
        )}
      </div>
    </FormProvider>
  );
}

export default App;
