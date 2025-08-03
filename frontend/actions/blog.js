import fetch from 'isomorphic-fetch';
import { API } from '../config';

export const createBlog = async (blog, token) => {
  try {
    const response = await fetch(`${API}/blog`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: blog,
    });

    const data = await response.json();

    if (!response.ok) {
      // Return the error from backend instead of throwing
      return { error: data.error || `HTTP error! status: ${response.status}` };
    }

    return data;
  } catch (err) {
    console.error('Blog creation error:', err);
    return { error: err.message || 'Network error occurred' };
  }
};
