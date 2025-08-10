import Layout from '../../components/Layout';
import { listAllBlogsCategoriesTags } from '../../actions/blog';
import Card from '../../components/blog/Card';

const Blogs = ({ blogs, categories, tags, size }) => {
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

export default Blogs;
