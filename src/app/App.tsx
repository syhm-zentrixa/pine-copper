import { Component, type ReactNode } from 'react';
import { HashRouter, NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { Clapperboard, Search as SearchIcon, Shapes } from 'lucide-react';
import Discover from '../features/Discover';
import Categories from '../features/Categories';
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
    <ErrorBoundary>
      <HashRouter>
        <div className="app">
          <header className="site-header">
            <div className="header-inner">
              <NavLink to="/discover" className="brand" aria-label="Pine — Danh sách phim">
                <Clapperboard size={27} />
                <span>
                  PINE<span className="brand-dot">.</span>
                </span>
              </NavLink>
              <nav aria-label="Điều hướng chính">
                <NavLink to="/discover">
                  <Clapperboard size={18} />
                  Danh sách phim
                </NavLink>
                <NavLink to="/categories">
                  <Shapes size={18} />
                  Categories
                </NavLink>
                <NavLink to="/search">
                  <SearchIcon size={18} />
                  Tìm kiếm
                </NavLink>
              </nav>
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
