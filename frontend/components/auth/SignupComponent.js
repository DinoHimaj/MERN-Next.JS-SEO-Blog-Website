import { useState } from 'react';

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
    console.log('Form submitted');
    console.table({ name, email, password, error, success, loading, showForm });
  };

  const handleChange = (name) => (e) => {
    setFormData({ ...formData, [name]: e.target.value });
  };

  const signupForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>SignUp Form</label>
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
  return <>{signupForm()}</>;
};

export default SignupComponent;
