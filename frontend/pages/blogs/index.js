import Head from 'next/head';
import Layout from '../../components/Layout';
import { listAllBlogsCategoriesTags } from '../../actions/blog';
import Card from '../../components/blog/Card';
import { APP_NAME, DOMAIN } from '../../config';
import { withRouter } from 'next/router';

const Blogs = ({ blogs, categories, tags, size, router }) => {
  const head = () => (
    <Head>
      <title>{`Programming blogs | ${APP_NAME}`}</title>
      <meta
        name='description'
        content='Programming blogs and tutorials on react node next vue php laravel and web development'
      />
      <link rel='canonical' href={`${DOMAIN}/blogs`} />

      {/* Open Graph for Social Media */}
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

      {/* Open Graph Images */}
      <meta property='og:image' content={`${DOMAIN}/images/seoblog.jpg`} />
      <meta
        property='og:image:secure_url'
        content={`${DOMAIN}/images/seoblog.jpg`}
      />
      <meta property='og:image:type' content='image/jpg' />

      {/* Optional: Twitter Card */}
      {/* <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:site' content='@yourtwitterhandle' />
      <meta name='twitter:creator' content='@yourtwitterhandle' /> */}

      {/* Optional: Facebook App ID if you have one */}
      {/* <meta property="fb:app_id" content={`${FB_APP_ID}`} /> */}
    </Head>
  );

  const showAllBlogs = () => {
    return blogs.map((blog, i) => (
      <article key={i}>
        <Card blog={blog} />
        <hr />
      </article>
    ));
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
            </section>
          </header>
        </div>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-md-12'>{showAllBlogs()}</div>
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

export default withRouter(Blogs);
