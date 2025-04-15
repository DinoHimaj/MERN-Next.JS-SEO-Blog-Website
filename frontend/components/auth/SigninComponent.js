import { useState, useEffect } from 'react';
import { signin, authenticate, isAuth } from '../../actions/auth';

import Router from 'next/router';

const SigninComponent = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    error: '',
    success: '',
    loading: false,
    showForm: true,
  });

  const { email, password, error, success, loading, showForm } = formData;

  // Redirect to home page if user is already authenticated
  useEffect(() => {
    if (isAuth()) {
      Router.push('/');
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData({ ...formData, loading: true, error: false });
    const user = { email, password };

    signin(user).then((data) => {
      if (data.error) {
        setFormData({
          ...formData,
          error: data.error,
          loading: false,
        });
      } else {
        //save user token to cookie
        //save user info to localstorage

        //authenticate user
        authenticate(data, () => {
          Router.push(`/`);
        });
      }
    });
  };

  const handleChange = (name) => (e) => {
    setFormData({
      ...formData,
      [name]: e.target.value,
      error: false,
      success: '',
    });
  };

  const showLoading = () =>
    loading ? (
      <div className='text-center my-2'>
        <div className='spinner-border text-primary' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
      </div>
    ) : (
      ''
    );
  const showError = () =>
    error ? <div className='alert alert-danger'>{error}</div> : '';
  const showSuccess = () =>
    success ? <div className='alert alert-success'>{success}</div> : '';

  const signinForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className='form-group mb-3'>
          <input
            onChange={handleChange('email')}
            value={email}
            type='email'
            className='form-control mb-3'
            placeholder='Enter Email'
          />

          <input
            onChange={handleChange('password')}
            value={password}
            type='password'
            className='form-control mb-3'
            placeholder='Enter Password'
          />
        </div>

        <div className='mb-3'>
          <button type='submit' className='btn btn-primary'>
            Sign In
          </button>
        </div>
      </form>
    );
  };
  return (
    <>
      {showLoading()}
      {showError()}
      {showSuccess()}
      {showForm && signinForm()}
    </>
  );
};

export default SigninComponent;
