import Layout from '../components/Layout';
import Link from 'next/link';

const Index = () => (
  <Layout>
    <div className='container'>
      <div className='page-header text-center mb-5'>
        <h1 className='display-4'>Welcome to SEOBLOGXXY</h1>
        <p className='lead'>
          Your ultimate destination for SEO insights and blogging tips
        </p>
      </div>

      <div className='row justify-content-center'>
        <div className='col-md-8'>
          <div className='card'>
            <div className='card-body text-center p-5'>
              <h2 className='card-title mb-4'>Get Started</h2>
              <p className='card-text text-muted mb-4'>
                Join our community to access exclusive content and manage your
                blog posts.
              </p>
              <div className='d-flex gap-3 justify-content-center'>
                <Link href='/signin' className='btn btn-primary btn-lg'>
                  <i className='bi bi-box-arrow-in-right me-2'></i>
                  Sign In
                </Link>
                <Link href='/signup' className='btn btn-outline-primary btn-lg'>
                  <i className='bi bi-person-plus me-2'></i>
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
);

export default Index;
