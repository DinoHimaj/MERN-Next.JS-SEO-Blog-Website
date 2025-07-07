import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, categories: data });
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
          setValues({ ...values, error: data.error });
        } else {
          loadCategories();
        }
      });
    }
  };

  const clickSubmit = (e) => {
    e.preventDefault();
    createCategory(values, token).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, success: false });
      } else {
        setValues({
          ...values,
          name: '',
          error: false,
          success: true,
          categories: [...categories, data],
        });
      }
    });
  };

  const handleChange = (name) => (e) => {
    setValues({ ...values, error: false, [name]: e.target.value });
  };

  const showSuccess = () => {
    if (success) {
      return <div className='alert alert-success'>{success}</div>;
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
        <div className='text-danger' style={{ display: error ? '' : 'none' }}>
          {error}
        </div>
        <div className='mt-3'>
          <button type='submit' className='btn btn-outline-primary'>
            Create
          </button>
        </div>
      </div>
    </form>
  );

  return (
    <React.Fragment>
      <h2>Create a new category</h2>
      {newCategoryForm()}
      <h2>All categories</h2>
      {showCategories()}
    </React.Fragment>
  );
};

export default Category;
