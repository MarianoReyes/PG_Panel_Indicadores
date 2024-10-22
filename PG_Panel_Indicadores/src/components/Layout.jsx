// Layout.jsx
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './Layout.css';

const Layout = ({ isAuthenticated, onLogout }) => {
  return (
    <div className="layout-container">
      <Header isAuthenticated={isAuthenticated} onLogout={onLogout} />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
