import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { useState } from 'react';
import { listAllBlogsCategoriesTags } from '../../actions/blog';
import { API } from '../../config';
import moment from 'moment';

const Blogs = ({ blogs, categories, tags, size }) => {
  const showAllBlogs = () => {
    return blogs.map((blog, i) => (
      <article key={i}>
        <div className='lead'>
          <header>
            <Link href={`/blog/${blog.slug}`}>
              <h2 className='display-4 pt-3 pb-3 font-weight-bold'>
                {blog.title}
              </h2>
            </Link>
          </header>
          <section>
            <p className='mark ml-1 pt-2 pb-2'>
              Written by {blog.postedBy.name} | Published{' '}
              {moment(blog.updatedAt).format('MMM DD, YYYY')}
            </p>
          </section>
          <section>
            <p>placeholder categories and tags</p>
          </section>

          <div className='row'>
            <div className='col-md-4'>
              <section>
                <img
                  className='img img-fluid'
                  src={`${API}/blog/photo/${blog.slug}`}
                  alt={blog.title}
                />
              </section>
            </div>
            <div className='col-md-8'>
              <section>
                <div className='pb-3'>{blog.excerpt}</div>
                <Link href={`/blog/${blog.slug}`} className='btn btn-primary'>
                  Read More
                </Link>
              </section>
            </div>
          </div>
        </div>
        <hr />
      </article>
    ));
  };
  return (
    <Layout>
      <main>
        <div className='container-fluid'>
          <header>
            <div className='col-md-12'>
              <h1 className='display-4 font-weight-bold text-center'>
                Programming and AI Blogs
              </h1>
            </div>
            <section>
              <p>show categories and tags(placeholder for now)</p>
            </section>
          </header>
        </div>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-md-12'>{showAllBlogs(blogs)}</div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

Blogs.getInitialProps = async () => {
  const data = await listAllBlogsCategoriesTags();
  if (data?.error) {
    return { blogs: [], categories: [], tags: [], size: 0, error: data.error };
  }
  const { blogs = [], categories = [], tags = [], size = 0 } = data || {};
  return { blogs, categories, tags, size };
};

export default Blogs;
