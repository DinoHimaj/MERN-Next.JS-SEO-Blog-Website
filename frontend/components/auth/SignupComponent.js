import { useState } from 'react';
import { signup } from '../../actions/auth';
const SignupComponent = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    error: '',
    success: '',
    loading: false,
    showForm: true,
  });

  const { name, email, password, error, success, loading, showForm } = formData;

  const handleSubmit = (e) => {
    e.preventDefault();
    //console.table({ name, email, password, error, success, loading, showForm });
    setFormData({ ...formData, loading: true, error: false });
    const user = { name, email, password };

    signup(user).then((data) => {
      if (data.error) {
        setFormData({
          ...formData,
          error: data.error,
          loading: false,
        });
      } else {
        setFormData({
          ...formData,
          name: '',
          email: '',
          password: '',
          error: '',
          success: data.message,
          loading: false,
        });

        // Clear success message after 3 seconds
        setTimeout(() => {
          setFormData((prevState) => ({
            ...prevState,
            success: '',
          }));
        }, 3000);
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

  const signupForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <input
            value={name}
            onChange={handleChange('name')}
            type='text'
            className='form-control'
            placeholder='Enter Name'
          />

          <input
            onChange={handleChange('email')}
            value={email}
            type='email'
            className='form-control'
            placeholder='Enter Email'
          />

          <input
            onChange={handleChange('password')}
            value={password}
            type='password'
            className='form-control'
            placeholder='Enter Password'
          />
        </div>

        <button type='submit' className='btn btn-primary'>
          Sign Up
        </button>
      </form>
    );
  };
  return (
    <>
      {showLoading()}
      {showError()}
      {showSuccess()}
      {showForm && signupForm()}
    </>
  );
};

export default SignupComponent;
