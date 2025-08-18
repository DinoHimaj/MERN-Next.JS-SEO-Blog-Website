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
      return { error: data.error || `HTTP error! status: ${response.status}` };
    }

    return data;
  } catch (err) {
    console.error('Blog creation error:', err);
    return { error: err.message || 'Network error occurred' };
  }
};

export const listAllBlogsCategoriesTags = async (limit = 10, skip = 0) => {
  try {
    const response = await fetch(`${API}/blogs-categories-tags`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ limit, skip }),
    });
    const data = await response.json();
    if (!response.ok) {
      return { error: data.error || `HTTP ${response.status}` };
    }
    return data;
  } catch (err) {
    console.error('Error fetching blogs, categories, and tags:', err);
    return { error: err.message || 'Network error occurred' };
  }
};

export const listBlogs = async () => {
  try {
    const response = await fetch(`${API}/blogs`);
    const data = await response.json();
    if (!response.ok) {
      return { error: data.error || `HTTP ${response.status}` };
    }
    return data; // Array of blogs only
  } catch (err) {
    return { error: err.message || 'Network error occurred' };
  }
};
