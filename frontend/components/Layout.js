import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className='min-vh-100 d-flex flex-column'>
      <Header />
      <main className='flex-grow-1 fade-in'>{children}</main>
      <footer className='footer mt-auto'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-6'>
              <p className='mb-0 text-muted'>
                © 2024 SEOBLOGXXY. All rights reserved.
              </p>
            </div>
            <div className='col-md-6 text-md-end'>
              <p className='mb-0 text-muted'>Built with Next.js & Bootstrap</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
