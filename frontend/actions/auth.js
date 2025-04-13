import fetch from 'isomorphic-fetch';
import cookie from 'js-cookie';
import { API } from '../config';

export const signup = async (user) => {
  try {
    const response = await fetch(`${API}/signup`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    // Handle non-200 responses
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Signup error:', err);
    return {
      error: 'An error occurred during signup. Please try again.',
    };
  }
};

export const signin = async (user) => {
  try {
    const response = await fetch(`${API}/signin`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    // Handle non-200 responses
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Signin error:', err);
    return {
      error: 'An error occurred during signin. Please try again.',
    };
  }
};

// Helper function for browser check
const isBrowser = () => typeof window !== 'undefined';

//set cookie
export const setCookie = (key, value) => {
  if (!isBrowser()) return;

  try {
    cookie.set(key, value, {
      expires: 1, // 1 day
      path: '/',
      //secure: process.env.NODE_ENV === 'production', // Secure in production
      sameSite: 'strict',
    });
  } catch (err) {
    console.error('Error setting cookie:', err);
  }
};

//remove cookie
export const removeCookie = (key) => {
  if (!isBrowser()) return;

  try {
    cookie.remove(key, {
      path: '/',
      //secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  } catch (err) {
    console.error('Error removing cookie:', err);
  }
};

//get cookie
export const getCookie = (key) => {
  if (!isBrowser()) return null;

  try {
    return cookie.get(key) || null;
  } catch (err) {
    console.error('Error getting cookie:', err);
    return null;
  }
};

//local storage
export const setLocalStorage = (key, value) => {
  if (isBrowser()) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const removeLocalStorage = (key) => {
  if (isBrowser()) {
    localStorage.removeItem(key);
  }
};

//authenticate user by passing data to cookie and localstorage
export const authenticate = (data, next) => {
  setCookie('token', data.token);
  setLocalStorage('user', data.user);
  next();
};

export const isAuth = () => {
  if (!isBrowser()) return false;

  if (isBrowser) {
    const cookieChecked = getCookie('token');
    if (cookieChecked) {
      if (localStorage.getItem('user')) {
        return JSON.parse(localStorage.getItem('user'));
      } else {
        return false;
      }
    }
  }
};
