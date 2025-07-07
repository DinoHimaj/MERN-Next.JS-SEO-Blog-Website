import fetch from 'isomorphic-fetch';
import { API } from '../config';

//create new category
export const createCategory = async (category, token) => {
  try {
    const response = await fetch(`${API}/category`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(category),
    });

    // Handle non-200 responses
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Category creation error:', err);
    return {
      error: 'An error occurred during category creation. Please try again.',
    };
  }
};

//get all categories
export const getCategories = async () => {
  try {
    const response = await fetch(`${API}/categories`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Category fetching error:', err);
  }
};

//get single category
export const getCategory = async (slug) => {
  try {
    const response = await fetch(`${API}/category/${slug}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Category fetching error:', err);
  }
};

//delete category
export const deleteCategory = async (slug, token) => {
  try {
    const response = await fetch(`${API}/category/${slug}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Category deletion error:', err);
  }
};
