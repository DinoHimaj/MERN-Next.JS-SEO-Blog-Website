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

  const publishBlog = (e) => {
    e.preventDefault();
    console.log('publishBlog');
  };

  const handleChange = (name) => (e) => {
    console.log(name, e.target.value);
  };

  const handleBodyChange = (body) => (value) => {
    console.log(body, value);
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
          <ReactQuill
            value={values.body}
            onChange={handleBodyChange('body')}
            placeholder='Write something...'
            className='form-control'
          />
        </div>

        <div>
          <button type='submit' className='btn btn-outline-primary'>
            Publish
          </button>
        </div>
      </form>
    );
  };

  return <div>{createBlogForm()}</div>;
};

export default withRouter(BlogCreate);
