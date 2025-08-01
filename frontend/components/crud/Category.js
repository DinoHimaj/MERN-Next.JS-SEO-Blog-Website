import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { isAuth, getCookie } from '../../actions/auth';
import {
  createCategory,
  getCategories,
  deleteCategory,
} from '../../actions/category';

const Category = () => {
  const [values, setValues] = useState({
    name: '',
    error: false,
    success: false,
    categories: [],
    removed: false,
  });

  const { name, error, success, categories, removed } = values;
  const token = getCookie('token');

  // Smart timer with user interaction detection
  const useSmartTimer = (messageType, messageValue) => {
    useEffect(() => {
      if (!messageValue) return;

      let timer;
      let hasInteracted = false;

      const clearMessage = () => {
        setValues((prev) => ({ ...prev, [messageType]: false }));
      };

      const handleInteraction = () => {
        if (!hasInteracted) {
          hasInteracted = true;
          clearTimeout(timer);
          timer = setTimeout(clearMessage, 1000); // 1 second on interaction
        }
      };

      // Start default 3-second timer
      timer = setTimeout(clearMessage, 3000);

      // Listen for interactions
      document.addEventListener('mousemove', handleInteraction);
      document.addEventListener('keydown', handleInteraction);

      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousemove', handleInteraction);
        document.removeEventListener('keydown', handleInteraction);
      };
    }, [messageValue, messageType]);
  };

  // Apply smart timer to all message types
  useSmartTimer('success', success);
  useSmartTimer('error', error);
  useSmartTimer('removed', removed);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        setValues((prev) => ({ ...prev, error: data.error }));
      } else {
        setValues((prev) => ({ ...prev, categories: data }));
      }
    });
  };

  const showCategories = () => {
    return categories.map((c, i) => (
      <button
        onDoubleClick={() => deleteConfirm(c.slug)}
        title='Double click to delete'
        key={i}
        className='btn btn-outline-primary mr-1 ml-1'
      >
        {c.name}
      </button>
    ));
  };

  const deleteConfirm = (slug) => {
    let answer = window.confirm(
      'Are you sure you want to delete this category?'
    );
    if (answer) {
      deleteCategory(slug, token).then((data) => {
        if (data.error) {
          setValues((prev) => ({ ...prev, error: data.error, removed: false }));
        } else {
          setValues((prev) => ({ ...prev, removed: true, error: false }));
          loadCategories();
        }
      });
    }
  };

  const clickSubmit = (e) => {
    e.preventDefault();
    createCategory(values, token).then((data) => {
      if (data.error) {
        setValues((prev) => ({ ...prev, error: data.error, success: false }));
      } else {
        setValues((prev) => ({
          ...prev,
          name: '',
          error: false,
          success: true,
          categories: [...categories, data],
        }));
      }
    });
  };

  const handleChange = (name) => (e) => {
    setValues((prev) => ({
      ...prev,
      error: false,
      success: false,
      [name]: e.target.value,
    }));
  };

  // ✅ Clean message components - NO manual close buttons
  const showSuccess = () => {
    if (success) {
      return (
        <div className='alert alert-success fade show' role='alert'>
          <strong>Success!</strong> Category created successfully
        </div>
      );
    }
  };

  const showError = () => {
    if (error) {
      return (
        <div className='alert alert-danger fade show' role='alert'>
          <strong>Error!</strong> {error}
        </div>
      );
    }
  };

  const showRemoved = () => {
    if (removed) {
      return (
        <div className='alert alert-info fade show' role='alert'>
          <strong>Deleted!</strong> Category deleted successfully
        </div>
      );
    }
  };

  const newCategoryForm = () => (
    <form onSubmit={clickSubmit}>
      <div className='form-group'>
        <label className='text-muted'>Name</label>
        <input
          type='text'
          className='form-control'
          onChange={handleChange('name')}
          value={name}
          required
        />
        <div className='mt-3'>
          <button type='submit' className='btn btn-success'>
            Create Category
          </button>
        </div>
      </div>
    </form>
  );

  return (
    <React.Fragment>
      <h2>Create a new category</h2>
      {showError()}
      {showSuccess()}
      {showRemoved()}
      {newCategoryForm()}
      <h2>All categories</h2>
      {showCategories()}
    </React.Fragment>
  );
};

export default Category;
