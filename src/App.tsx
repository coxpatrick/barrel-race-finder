import { BrowserRouter, Routes, Route, ScrollRestoration } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BrowseEventsPage from './pages/BrowseEventsPage';
import EventDetailPage from './pages/EventDetailPage';
import SubmitEventPage from './pages/SubmitEventPage';
import AboutPage from './pages/AboutPage';
import AuthPage from './pages/AuthPage';
import AccountPage from './pages/AccountPage';
// Scroll to top on route change
function ScrollToTop() {
  return null; // react-router-dom v6 handles this via ScrollRestoration
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/"             element={<HomePage />} />
            <Route path="/events"       element={<BrowseEventsPage />} />
            <Route path="/events/:id"   element={<EventDetailPage />} />
            <Route path="/submit"       element={<SubmitEventPage />} />
            <Route path="/about"        element={<AboutPage />} />
            <Route path="/auth"         element={<AuthPage />} />
            <Route path="/account"      element={<AccountPage />} />
            {/* TODO: Add protected routes when user auth is implemented */}
            {/* <Route path="/dashboard"  element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} /> */}
            {/* <Route path="/favorites"  element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} /> */}
            {/* 404 fallback */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center text-center px-6 pt-24">
                <div>
                  <div className="text-6xl mb-4">🤠</div>
                  <h1 className="font-display text-3xl font-700 mb-2">Page Not Found</h1>
                  <p className="font-body text-dust-500 mb-6">Looks like this trail's a dead end.</p>
                  <a href="/" className="btn-primary">Head Back Home</a>
                </div>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
