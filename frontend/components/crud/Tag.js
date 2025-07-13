import React, { useState, useEffect } from 'react';
import { createTag, getTags, deleteTag } from '../../actions/tag';
import { getCookie } from '../../actions/auth';

const Tag = () => {
  const [values, setValues] = useState({
    name: '',
    error: false,
    success: false,
    tags: [],
    removed: false,
  });

  const { name, error, success, tags, removed } = values;
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
    loadTags();
  }, []);

  const loadTags = () => {
    getTags().then((data) => {
      if (data.error) {
        setValues((prev) => ({ ...prev, error: data.error }));
      } else {
        setValues((prev) => ({ ...prev, tags: data }));
      }
    });
  };

  const showTags = () => {
    return tags.map((t, i) => (
      <button
        onDoubleClick={() => deleteConfirm(t.slug)}
        title='Double click to delete'
        key={i}
        className='btn btn-outline-primary mr-1 ml-1'
      >
        {t.name}
      </button>
    ));
  };

  const deleteConfirm = (slug) => {
    let answer = window.confirm('Are you sure you want to delete this tag?');
    if (answer) {
      deleteTag(slug, token).then((data) => {
        if (data.error) {
          setValues((prev) => ({ ...prev, error: data.error, removed: false }));
        } else {
          setValues((prev) => ({ ...prev, removed: true, error: false }));
          loadTags();
        }
      });
    }
  };

  const clickSubmit = (e) => {
    e.preventDefault();
    createTag(values, token).then((data) => {
      if (data.error) {
        setValues((prev) => ({ ...prev, error: data.error, success: false }));
      } else {
        setValues((prev) => ({
          ...prev,
          name: '',
          error: false,
          success: true,
          tags: [...tags, data],
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
          <strong>Success!</strong> Tag created successfully
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
          <strong>Deleted!</strong> Tag deleted successfully
        </div>
      );
    }
  };

  const newTagForm = () => (
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
            Create Tag
          </button>
        </div>
      </div>
    </form>
  );

  return (
    <React.Fragment>
      <h2>Create a new tag</h2>
      {showError()}
      {showSuccess()}
      {showRemoved()}
      {newTagForm()}
      <h2>All tags</h2>
      {showTags()}
    </React.Fragment>
  );
};

export default Tag;
