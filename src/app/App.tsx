import { Component, type ReactNode } from 'react';
import { HashRouter, NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { Clapperboard, Search as SearchIcon, Shapes } from 'lucide-react';
import Discover from '../features/Discover';
import Categories from '../features/Categories';
import { LanguageProvider, useLanguage } from '../i18n';
import Search from '../features/Search';
import Player from '../features/Player';
class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <main className="empty-state">
        <h1>Không mở được trang</h1>
        <button className="button" onClick={() => location.reload()}>
          Tải lại
        </button>
      </main>
    ) : (
      this.props.children
    );
  }
}
export default function App() {
  return (
    <LanguageProvider>
      <AppShell />
    </LanguageProvider>
  );
}

function AppShell() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <ErrorBoundary>
      <HashRouter>
        <div className="app">
          <header className="site-header">
            <div className="header-inner">
              <NavLink to="/discover" className="brand" aria-label={`Pine — ${t('Movie list')}`}>
                <Clapperboard size={27} />
                <span>
                  PINE<span className="brand-dot">.</span>
                </span>
              </NavLink>
              <nav aria-label="Main navigation">
                <NavLink to="/discover">
                  <Clapperboard size={18} />
                  {t('Movie list')}
                </NavLink>
                <NavLink to="/categories">
                  <Shapes size={18} />
                  {t('Categories')}
                </NavLink>
                <NavLink to="/search">
                  <SearchIcon size={18} />
                  {t('Search')}
                </NavLink>
              </nav>
              <div className="language-toggle" aria-label="Language">
                <button
                  aria-pressed={language === 'en'}
                  className={language === 'en' ? 'active' : ''}
                  onClick={() => setLanguage('en')}
                >
                  EN
                </button>
                <span />
                <button
                  aria-pressed={language === 'vi'}
                  className={language === 'vi' ? 'active' : ''}
                  onClick={() => setLanguage('vi')}
                >
                  VI
                </button>
              </div>
            </div>
          </header>
          <main id="main-content">
            <Routes>
              <Route path="/discover" element={<Discover />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/search" element={<Search />} />
              <Route path="/watch/:id" element={<Player />} />
              <Route path="*" element={<Navigate to="/discover" replace />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </ErrorBoundary>
  );
}
