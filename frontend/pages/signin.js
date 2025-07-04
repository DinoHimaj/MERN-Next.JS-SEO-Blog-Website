import Layout from '../components/Layout';
import SigninComponent from '../components/auth/SigninComponent';

const Signin = () => {
  return (
    <Layout>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-md-6 col-lg-5'>
            <div className='card'>
              <div className='card-body p-5'>
                <div className='text-center mb-4'>
                  <h2 className='card-title'>Welcome Back</h2>
                  <p className='text-muted'>Sign in to your account</p>
                </div>
                <SigninComponent />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Signin;
