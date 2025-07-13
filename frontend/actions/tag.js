import fetch from 'isomorphic-fetch';
import { API } from '../config';

//create tag
export const createTag = async (tag, token) => {
  try {
    const response = await fetch(`${API}/tag`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(tag),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Tag creation error:', err);
    return {
      error: 'An error occurred during tag creation. Please try again.',
    };
  }
};

//list tags
export const getTags = async () => {
  try {
    const response = await fetch(`${API}/tags`, {
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
    console.error('Tag fetching error:', err);
  }
};

//get single tag
export const getTag = async (slug) => {
  try {
    const response = await fetch(`${API}/tag/${slug}`, {
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
    console.error('Tag fetching error:', err);
  }
};

export const deleteTag = async (slug, token) => {
  try {
    const response = await fetch(`${API}/tag/${slug}`, {
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
    console.error('Tag deletion error:', err);
  }
};
