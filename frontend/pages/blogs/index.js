import Head from 'next/head';
import Layout from '../../components/Layout';
import { listAllBlogsCategoriesTags } from '../../actions/blog';
import Card from '../../components/blog/Card';
import { APP_NAME, DOMAIN } from '../../config';
import { withRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';

const Blogs = ({ initialBlogs, categories, tags, initialSize, router }) => {
  const scrollRestoredRef = useRef(false);

  // Try to restore previous state from sessionStorage
  const [blogs, setBlogs] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedState = sessionStorage.getItem('blogListState');
      if (savedState) {
        try {
          const { blogs: savedBlogs, timestamp } = JSON.parse(savedState);
          // Return saved blogs if recent
          if (Date.now() - timestamp < 30 * 60 * 1000) {
            return savedBlogs;
          }
        } catch (e) {
          return initialBlogs;
        }
      }
    }
    return initialBlogs;
  });

  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [hasMore, setHasMore] = useState(() => {
    if (blogs.length > initialSize) {
      return true;
    }
    return initialSize >= 2;
  });

  // Save state AND scroll position before leaving
  useEffect(() => {
    const handleRouteChangeStart = (url) => {
      // Only save if navigating to a blog detail page
      if (url.startsWith('/blogs/') && url !== '/blogs') {
        const scrollData = {
          blogs: blogs,
          scrollY: window.scrollY,
          timestamp: Date.now(),
        };
        sessionStorage.setItem('blogListState', JSON.stringify(scrollData));
      }
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
    };
  }, [blogs, router.events]);

  // Restore scroll position after blogs render
  useEffect(() => {
    if (!scrollRestoredRef.current && typeof window !== 'undefined') {
      const savedState = sessionStorage.getItem('blogListState');
      if (savedState) {
        try {
          const { scrollY, timestamp } = JSON.parse(savedState);
          // Only restore if it's recent (within 30 minutes)
          if (Date.now() - timestamp < 30 * 60 * 1000) {
            // Small delay to ensure DOM is ready
            setTimeout(() => {
              window.scrollTo(0, scrollY);
              scrollRestoredRef.current = true;
            }, 100);
          }
        } catch (e) {
          // Silent fail
        }
      }
    }
  }, [blogs]); // Run when blogs are loaded

  useEffect(() => {
    // Clear old session data if user came from external link or refresh
    if (!document.referrer.includes(window.location.hostname)) {
      sessionStorage.removeItem('blogListState');
    }
  }, []);

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
      <article key={blog._id || i} className='blog-article fade-in'>
        <Card blog={blog} />
      </article>
    ));
  };

  const showLoadMoreButton = () => {
    if (!hasMore && !loadMoreLoading) {
      return (
        <div className='blogs-end-message'>
          <p>✨ You've reached the end of our stories</p>
        </div>
      );
    }

    if (!hasMore) return null;

    return (
      <div className='text-center mt-5 mb-5'>
        <button
          className='btn btn-outline-primary btn-lg btn-load-more'
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
              Loading...
            </>
          ) : (
            'Load More'
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
          <header className='page-header text-center mb-5'>
            <div className='container'>
              <h1 className='display-3 font-weight-bold blog-header-title'>
                Programming & AI Insights
              </h1>
              <p className='lead text-white-50 blog-header-subtitle'>
                Discover the latest in web development, technology, and
                innovation
              </p>
            </div>
          </header>

          <div className='container blog-container'>
            <section className='mb-4'>
              <div className='blog-stats'>
                {blogs.length === 0 ? (
                  'No blogs available yet'
                ) : (
                  <>
                    Currently viewing <strong>{blogs.length}</strong>
                    {blogs.length === 1 ? ' article' : ' articles'}
                  </>
                )}
              </div>
            </section>

            <div className='row'>
              <div className='col-lg-10 mx-auto'>
                {showAllBlogs()}
                {showLoadMoreButton()}
              </div>
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
