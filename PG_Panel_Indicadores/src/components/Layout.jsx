import Header from './Header';
import Footer from './Footer';
import './Layout.css';

const Layout = ({ children, isAuthenticated, onLogin, onLogout }) => {
  return (
    <div className="layout-container">
      <Header isAuthenticated={isAuthenticated} onLogin={onLogin} onLogout={onLogout} />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
