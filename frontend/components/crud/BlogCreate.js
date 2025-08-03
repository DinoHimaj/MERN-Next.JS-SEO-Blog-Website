import Link from 'next/link';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router';
import { getCookie, isAuth } from '../../actions/auth';
import { getCategories } from '../../actions/category';
import { getTags } from '../../actions/tag';
import { createBlog } from '../../actions/blog';
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
});
import 'react-quill/dist/quill.snow.css';

const BlogCreate = ({ router }) => {
  const [body, setBody] = useState('');
  const [hasMounted, setHasMounted] = useState(false);

  const [values, setValues] = useState({
    error: '',
    sizeError: '',
    success: '',
    formData: new FormData(),
    title: '',
    hidePublishButton: false,
  });

  // Add validation state
  const [validationErrors, setValidationErrors] = useState({
    title: '',
    body: '',
    categories: '',
    tags: '',
  });

  const { error, sizeError, success, formData, title, hidePublishButton } =
    values;
  const token = getCookie('token');

  useEffect(() => {
    setHasMounted(true);

    // Load from localStorage only after component mounts
    if (typeof window !== 'undefined' && localStorage.getItem('blog')) {
      try {
        const savedContent = JSON.parse(localStorage.getItem('blog'));
        setBody(savedContent);
      } catch (err) {
        console.error('Error loading from localStorage:', err);
      }
    }
  }, []);

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [checkedCategories, setCheckedCategories] = useState([]);
  const [checkedTags, setCheckedTags] = useState([]);

  const initCategories = async () => {
    try {
      const data = await getCategories();
      if (data) {
        setCategories(data);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const initTags = async () => {
    try {
      const data = await getTags();
      if (data) {
        setTags(data);
      }
    } catch (err) {
      console.error('Error loading tags:', err);
    }
  };

  useEffect(() => {
    setValues((prevValues) => ({
      ...prevValues,
      formData: new FormData(),
    }));
    // Reset checked states when router changes
    setCheckedCategories([]);
    setCheckedTags([]);
    setValidationErrors({ title: '', body: '', categories: '', tags: '' });
    initCategories();
    initTags();
  }, [router]);

  // Real-time validation function - MODIFIED to accept actual values
  const validateField = (
    fieldName,
    value,
    categoriesArray = null,
    tagsArray = null
  ) => {
    let error = '';

    switch (fieldName) {
      case 'title':
        if (!value || value.trim().length === 0) {
          error = 'Title is required';
        }
        break;
      case 'body':
        if (!value || value.length < 400) {
          error = `Content must be at least 400 characters (current: ${value.length})`;
        }
        break;
      case 'categories':
        // Use passed array or fallback to state
        const categoriesToCheck =
          categoriesArray !== null ? categoriesArray : checkedCategories;
        if (categoriesToCheck.length === 0) {
          error = 'At least one category must be selected';
        }
        break;
      case 'tags':
        // Use passed array or fallback to state
        const tagsToCheck = tagsArray !== null ? tagsArray : checkedTags;
        if (tagsToCheck.length === 0) {
          error = 'At least one tag must be selected';
        }
        break;
    }

    setValidationErrors((prev) => ({ ...prev, [fieldName]: error }));
    return error === '';
  };

  // Validate all fields - MODIFIED to use current arrays
  const validateAllFields = () => {
    const titleValid = validateField('title', title);
    const bodyValid = validateField('body', body);
    const categoriesValid = validateField(
      'categories',
      '',
      checkedCategories,
      null
    );
    const tagsValid = validateField('tags', '', null, checkedTags);

    return titleValid && bodyValid && categoriesValid && tagsValid;
  };

  const publishBlog = (e) => {
    e.preventDefault();

    // Validate all fields before submission
    if (!validateAllFields()) {
      setValues({
        ...values,
        error: 'Please fix all validation errors before publishing',
      });
      return;
    }

    createBlog(formData, token).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          title: '',
          error: '',
          success: `A new blog titled "${data.blog.title}" has been created successfully!`,
        });
        setBody('');
        setCheckedCategories([]);
        setCheckedTags([]);
        setValidationErrors({ title: '', body: '', categories: '', tags: '' });
        // Clear localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('blog');
        }
        // Clear FormData
        formData.delete('categories');
        formData.delete('tags');
        formData.delete('photo');
        formData.delete('title');
        formData.delete('body');
      }
    });
  };

  const handleChange = (name) => (e) => {
    const value = name === 'photo' ? e.target.files[0] : e.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value, formData, error: '' });

    // Real-time validation
    if (name === 'title') {
      validateField('title', value);
    }
  };

  const handleBodyChange = (e) => {
    setBody(e);
    formData.set('body', e);

    // Real-time validation
    validateField('body', e);

    if (typeof window !== 'undefined') {
      localStorage.setItem('blog', JSON.stringify(e));
    }
  };

  const handleCategoryToggle = (c) => {
    setValues({ ...values, error: '' });

    const clickedCategory = checkedCategories.indexOf(c);
    const allCategories = [...checkedCategories];
    if (clickedCategory === -1) {
      allCategories.push(c);
    } else {
      allCategories.splice(clickedCategory, 1);
    }

    setCheckedCategories(allCategories);
    formData.set('categories', allCategories.join(','));

    // Real-time validation - FIXED: Pass the new array directly
    validateField('categories', '', allCategories, null);
  };

  const handleTagToggle = (t) => {
    setValues({ ...values, error: '' });
    const clickedTag = checkedTags.indexOf(t);
    const allTags = [...checkedTags];
    if (clickedTag === -1) {
      allTags.push(t);
    } else {
      allTags.splice(clickedTag, 1);
    }

    setCheckedTags(allTags);
    formData.set('tags', allTags.join(','));

    // Real-time validation - FIXED: Pass the new array directly
    validateField('tags', '', null, allTags);
  };

  const showCategories = () => {
    return categories.map((c) => (
      <li className='list-unstyled' key={c._id}>
        <input
          onChange={() => handleCategoryToggle(c._id)}
          type='checkbox'
          className='mr-2'
          checked={checkedCategories.includes(c._id)}
        />
        <label className='form-check-label'>{c.name}</label>
      </li>
    ));
  };

  const showTags = () => {
    return tags.map((t) => (
      <li className='list-unstyled' key={t._id}>
        <input
          onChange={() => handleTagToggle(t._id)}
          type='checkbox'
          className='mr-2'
          checked={checkedTags.includes(t._id)}
        />
        <label className='form-check-label'>{t.name}</label>
      </li>
    ));
  };

  // Error display component
  const ValidationError = ({ error }) => {
    if (!error) return null;
    return <div className='text-danger small mt-1'>{error}</div>;
  };

  // Success/Error message display
  const showMessage = () => {
    if (success) {
      return <div className='alert alert-success'>{success}</div>;
    }
    if (error) {
      return <div className='alert alert-danger'>{error}</div>;
    }
    return null;
  };

  const createBlogForm = () => {
    return (
      <form onSubmit={publishBlog}>
        {showMessage()}

        <div className='form-group'>
          <label className='text-muted'>Title *</label>
          <input
            type='text'
            className={`form-control ${
              validationErrors.title ? 'is-invalid' : ''
            }`}
            value={values.title}
            onChange={handleChange('title')}
            placeholder='Enter blog title...'
          />
          <ValidationError error={validationErrors.title} />
        </div>

        <div className='form-group'>
          <label className='text-muted'>
            Content * (minimum 400 characters)
          </label>
          {hasMounted && (
            <div>
              <ReactQuill
                modules={BlogCreate.modules}
                formats={BlogCreate.formats}
                value={body}
                onChange={handleBodyChange}
                placeholder='Write your blog content here... (minimum 200 characters)'
                className={`form-control ${
                  validationErrors.body ? 'border-danger' : ''
                }`}
                style={validationErrors.body ? { borderColor: '#dc3545' } : {}}
              />
              <small className='text-muted'>
                Characters: {body.length}/200 minimum
              </small>
            </div>
          )}
          {!hasMounted && (
            <div
              className='form-control'
              style={{ minHeight: '200px', padding: '12px' }}
            >
              Loading editor...
            </div>
          )}
          <ValidationError error={validationErrors.body} />
        </div>

        <div>
          <button
            type='submit'
            className='btn btn-primary'
            disabled={Object.values(validationErrors).some(
              (error) => error !== ''
            )}
          >
            Publish Blog
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-8'>
          <h1>Create Blog</h1>
          {createBlogForm()}
        </div>

        <div className='col-md-4'>
          {/* Featured Image Section */}
          <div className='form-group pb-2'>
            <h5>Featured Image</h5>
            <hr />
            <small className='text-muted d-block mb-3'>
              Maximum file size: 1MB (Optional)
            </small>
            <label className='btn btn-outline-primary btn-block'>
              Upload Image
              <input
                type='file'
                accept='image/*'
                onChange={handleChange('photo')}
                hidden
              />
            </label>
          </div>

          {/* Categories Section */}
          <div className='form-group pb-2'>
            <h5>
              Categories *{' '}
              <small className='text-muted'>(Select at least one)</small>
            </h5>
            <hr />
            <ul
              style={{ maxHeight: '200px', overflowY: 'scroll' }}
              className={`list-unstyled ${
                validationErrors.categories
                  ? 'border border-danger p-2 rounded'
                  : ''
              }`}
            >
              {showCategories()}
            </ul>
            <ValidationError error={validationErrors.categories} />
          </div>

          {/* Tags Section */}
          <div className='form-group pb-2'>
            <h5>
              Tags * <small className='text-muted'>(Select at least one)</small>
            </h5>
            <hr />
            <ul
              style={{ maxHeight: '200px', overflowY: 'scroll' }}
              className={`list-unstyled ${
                validationErrors.tags ? 'border border-danger p-2 rounded' : ''
              }`}
            >
              {showTags()}
            </ul>
            <ValidationError error={validationErrors.tags} />
          </div>
        </div>
      </div>
    </div>
  );
};

BlogCreate.modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { header: [3, 4, 5, 6] }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image', 'video'],
    ['clean'],
    ['code-block'],
  ],
};

BlogCreate.formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'link',
  'image',
  'video',
  'code-block',
];

export default withRouter(BlogCreate);
