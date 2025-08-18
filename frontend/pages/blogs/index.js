import Head from 'next/head';
import Layout from '../../components/Layout';
import { listAllBlogsCategoriesTags } from '../../actions/blog';
import Card from '../../components/blog/Card';
import { APP_NAME, DOMAIN } from '../../config';
import { withRouter } from 'next/router';
import { useState } from 'react';

const Blogs = ({ initialBlogs, categories, tags, initialSize, router }) => {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialSize >= 2);

  const head = () => (
    <Head>
      <title>{`Programming blogs | ${APP_NAME}`}</title>
      <meta
        name='description'
        content='Programming blogs and tutorials on react node next vue php laravel and web development'
      />
      <link rel='canonical' href={`${DOMAIN}/blogs`} />

      <meta
        property='og:title'
        content={`Latest web development tutorials | ${APP_NAME}`}
      />
      <meta
        property='og:description'
        content='Programming blogs and tutorials on react node next vue php laravel and web development'
      />
      <meta property='og:type' content='website' />
      <meta property='og:url' content={`${DOMAIN}/blogs`} />
      <meta property='og:site_name' content={`${APP_NAME}`} />

      <meta property='og:image' content={`${DOMAIN}/images/seoblog.jpg`} />
      <meta
        property='og:image:secure_url'
        content={`${DOMAIN}/images/seoblog.jpg`}
      />
      <meta property='og:image:type' content='image/jpg' />
    </Head>
  );

  const loadMoreBlogs = async () => {
    if (loadMoreLoading || !hasMore) return;

    setLoadMoreLoading(true);
    try {
      const skip = blogs.length;
      const limit = 3;

      const data = await listAllBlogsCategoriesTags(limit, skip);

      if (data?.error) {
        return;
      }

      const { blogs: newBlogs = [] } = data;

      if (newBlogs.length === 0) {
        setHasMore(false);
      } else {
        setBlogs((prevBlogs) => [...prevBlogs, ...newBlogs]);
        setHasMore(newBlogs.length >= limit);
      }
    } catch (error) {
      console.error('Load more blogs error:', error);
    } finally {
      setLoadMoreLoading(false);
    }
  };

  const showAllBlogs = () => {
    return blogs.map((blog, i) => (
      <article key={blog._id || i}>
        <Card blog={blog} />
        <hr />
      </article>
    ));
  };

  const showLoadMoreButton = () => {
    if (!hasMore && !loadMoreLoading) {
      return (
        <div className='text-center mt-4 mb-5'>
          <p className='text-muted'>No more blogs to load</p>
        </div>
      );
    }

    if (!hasMore) return null;

    return (
      <div className='text-center mt-4 mb-5'>
        <button
          className='btn btn-outline-primary btn-lg'
          onClick={loadMoreBlogs}
          disabled={loadMoreLoading}
        >
          {loadMoreLoading ? (
            <>
              <span
                className='spinner-border spinner-border-sm me-2'
                role='status'
                aria-hidden='true'
              ></span>
              Loading more blogs...
            </>
          ) : (
            <>Load More Blogs ({blogs.length} loaded)</>
          )}
        </button>
      </div>
    );
  };

  return (
    <Layout>
      {head()}
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
              <p className='text-muted text-center'>
                Showing {blogs.length} blog{blogs.length !== 1 ? 's' : ''}
              </p>
            </section>
          </header>
        </div>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-md-12'>
              {showAllBlogs()}
              {showLoadMoreButton()}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

Blogs.getInitialProps = async () => {
  const data = await listAllBlogsCategoriesTags(2, 0);
  if (data?.error) {
    return {
      initialBlogs: [],
      categories: [],
      tags: [],
      initialSize: 0,
      error: data.error,
    };
  }
  const { blogs = [], categories = [], tags = [], size = 0 } = data || {};
  return {
    initialBlogs: blogs,
    categories,
    tags,
    initialSize: blogs.length,
  };
};

export default withRouter(Blogs);
