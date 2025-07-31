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

  const { error, sizeError, success, formData, title, hidePublishButton } =
    values;

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
    initCategories();
    initTags();
  }, [router]);

  const publishBlog = (e) => {
    e.preventDefault();
    console.log('publishBlog');
  };

  const handleChange = (name) => (e) => {
    const value = name === 'photo' ? e.target.files[0] : e.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value, formData, error: '' });
  };

  const handleBodyChange = (e) => {
    setBody(e);
    formData.set('body', e);

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
    console.log(allCategories);
    setCheckedCategories(allCategories);
    formData.set('categories', allCategories);
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
    console.log(allTags);
    setCheckedTags(allTags);
    formData.set('tags', allTags);
  };

  const showCategories = () => {
    return categories.map((c) => (
      <li className='list-unstyled' key={c._id}>
        <input
          onChange={() => handleCategoryToggle(c._id)}
          type='checkbox'
          className='mr-2'
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
        />
        <label className='form-check-label'>{t.name}</label>
      </li>
    ));
  };

  const createBlogForm = () => {
    return (
      <form onSubmit={publishBlog}>
        <div className='form-group'>
          <label className='text-muted'>Title</label>
          <input
            type='text'
            className='form-control'
            value={values.title}
            onChange={handleChange('title')}
          />
        </div>
        <div className='form-group'>
          {hasMounted && (
            <ReactQuill
              modules={BlogCreate.modules}
              formats={BlogCreate.formats}
              value={body}
              onChange={handleBodyChange}
              placeholder='Write something...'
              className='form-control'
            />
          )}
          {!hasMounted && (
            <div
              className='form-control'
              style={{ minHeight: '200px', padding: '12px' }}
            >
              Loading editor...
            </div>
          )}
        </div>

        <div>
          <button type='submit' className='btn btn-outline-primary'>
            Publish
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

        <div className='col-md-3'>
          <div>
            <h5>Categories</h5>
            <hr />
            <ul style={{ maxHeight: '200px', overflowY: 'scroll' }}>
              {showCategories()}
            </ul>
          </div>
          <div>
            <h5>Tags</h5>
            <hr />
            <ul style={{ maxHeight: '200px', overflowY: 'scroll' }}>
              {showTags()}
            </ul>
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
