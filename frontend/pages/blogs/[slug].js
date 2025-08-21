import Head from 'next/head';
import Layout from '../../components/Layout';
import { getSingleBlog } from '../../actions/blog';
import { APP_NAME, DOMAIN, API } from '../../config';
import moment from 'moment';
import Link from 'next/link';
import { withRouter } from 'next/router';

const SingleBlog = ({ blog, error, router }) => {
  if (error) {
    return (
      <Layout>
        <div className='container'>
          <div className='alert alert-danger mt-5' role='alert'>
            {error}
          </div>
        </div>
      </Layout>
    );
  }

  const head = () => (
    <Head>
      <title>{`${blog.title} | ${APP_NAME}`}</title>
      <meta name='description' content={blog.mdesc || blog.excerpt} />
      <link rel='canonical' href={`${DOMAIN}/blogs/${blog.slug}`} />

      {/* Open Graph meta tags */}
      <meta property='og:title' content={`${blog.title} | ${APP_NAME}`} />
      <meta property='og:description' content={blog.mdesc || blog.excerpt} />
      <meta property='og:type' content='article' />
      <meta property='og:url' content={`${DOMAIN}/blogs/${blog.slug}`} />
      <meta property='og:site_name' content={`${APP_NAME}`} />
      <meta property='og:image' content={`${API}/blog/photo/${blog.slug}`} />
      <meta
        property='og:image:secure_url'
        content={`${API}/blog/photo/${blog.slug}`}
      />
      <meta property='og:image:type' content='image/jpg' />

      {/* Twitter Card tags */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={`${blog.title} | ${APP_NAME}`} />
      <meta name='twitter:description' content={blog.mdesc || blog.excerpt} />
      <meta name='twitter:image' content={`${API}/blog/photo/${blog.slug}`} />

      {/* Article specific meta */}
      <meta property='article:published_time' content={blog.createdAt} />
      <meta property='article:modified_time' content={blog.updatedAt} />
      <meta property='article:author' content={blog.postedBy?.name} />
    </Head>
  );

  const showBlogCategories = () =>
    blog?.categories?.map((c, i) => (
      <Link key={i} href={`/categories/${c.slug}`} className='badge-category'>
        {c.name}
      </Link>
    ));

  const showBlogTags = () =>
    blog?.tags?.map((t, i) => (
      <Link key={i} href={`/tags/${t.slug}`} className='badge-tag'>
        #{t.name}
      </Link>
    ));

  const handleGoBack = (e) => {
    e.preventDefault();
    router.back();
  };

  return (
    <>
      {head()}
      <Layout>
        <main>
          {/* Hero section with featured image */}
          <div className='container-fluid p-0'>
            <div className='blog-hero-container'>
              <img
                src={`${API}/blog/photo/${blog.slug}`}
                alt={blog.title}
                className='blog-hero-image'
              />
              <div className='blog-hero-overlay'></div>
            </div>
          </div>

          <article className='container py-5'>
            <div className='row'>
              <div className='col-lg-8 mx-auto blog-article-container'>
                {/* Article Header */}
                <header className='mb-5'>
                  <h1 className='blog-title'>{blog.title}</h1>

                  {/* Meta information */}
                  <div className='blog-card-meta mb-4'>
                    <span className='blog-card-author'>
                      {blog.postedBy?.name}
                    </span>
                    <span className='mx-2'>•</span>
                    <time dateTime={blog.updatedAt}>
                      {moment(blog.updatedAt).format('MMM DD, YYYY')}
                    </time>
                    <span className='mx-2'>•</span>
                    {moment(blog.updatedAt).fromNow()}
                  </div>

                  {/* Categories and Tags */}
                  <div className='mb-4'>
                    {showBlogCategories()}
                    {showBlogTags()}
                  </div>
                </header>

                {/* Article Content */}
                <div className='blog-content'>
                  <div className='blog-excerpt'>{blog.excerpt}</div>
                  <div dangerouslySetInnerHTML={{ __html: blog.body }} />
                </div>

                {/* Author Box */}
                <div className='card border-0 blog-author-box'>
                  <h5 className='mb-3'>About the Author</h5>
                  <div>
                    <h6 className='blog-author-name'>{blog.postedBy?.name}</h6>
                    <p className='blog-author-bio'>
                      {blog.postedBy?.profile ||
                        'Contributing writer and technology enthusiast.'}
                    </p>
                  </div>
                </div>

                {/* Navigation - Using router.back() to preserve state */}
                <div className='blog-navigation'>
                  <button
                    onClick={handleGoBack}
                    className='btn btn-outline-primary'
                  >
                    ← Back to Articles
                  </button>
                </div>
              </div>
            </div>
          </article>
        </main>
      </Layout>
    </>
  );
};

// Server-side rendering for SEO
SingleBlog.getInitialProps = async ({ query }) => {
  try {
    const data = await getSingleBlog(query.slug);

    if (data.error) {
      return { error: data.error };
    }

    return { blog: data };
  } catch (error) {
    return { error: 'Failed to load blog' };
  }
};

export default withRouter(SingleBlog);
