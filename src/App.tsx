import { Routes, Route } from 'react-router-dom';

// Import our components
import InputSection from './components/InputSection';
import ChromeStoreSection from './components/ChromeStoreSection';
import PictureSection from './components/PictureSection';
import MapView from './components/MapView';
import AddReviewForm from './components/AddReviewForm';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white py-6 border-b">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center text-blue-800">Casero Verificado</h1>
          <p className="text-center text-gray-600">Consulta y comparte opiniones anónimas sobre caseros</p>
        </div>
      </header>

      <Routes>
        <Route path="/map" element={<MapView />} />
        <Route path="/add-review" element={<AddReviewForm />} />
        <Route path="/" element={
          <>
            {/* Main content with our three sections */}
            <InputSection />
            <ChromeStoreSection />
            <PictureSection />
          </>
        } />
      </Routes>

      <footer className="max-w-6xl mx-auto mt-8 text-center text-gray-500 text-sm py-6">
        <p>© {new Date().getFullYear()} Casero Verificado - Todas las opiniones son anónimas</p>
      </footer>
    </div>
  );
}

export default App;
