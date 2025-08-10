import Link from 'next/link';
import moment from 'moment';
import { API } from '../../config';

const Card = ({ blog }) => {
  const showBlogCategories = (b) =>
    b?.categories?.map((c, i) => (
      <Link
        key={i}
        href={`/categories/${c.slug}`}
        className='badge badge-primary mr-2'
        style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
      >
        {c.name}
      </Link>
    ));

  const showBlogTags = (b) =>
    b?.tags?.map((t, i) => (
      <Link
        key={i}
        href={`/tags/${t.slug}`}
        className='badge badge-light text-dark border mr-2'
        style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
      >
        #{t.name}
      </Link>
    ));

  return (
    <div className='lead'>
      <header>
        <Link href={`/blog/${blog.slug}`}>
          <h2 className='display-4 pt-3 pb-3 font-weight-bold'>{blog.title}</h2>
        </Link>
      </header>

      <section>
        <p className='mark ml-1 pt-2 pb-2'>
          Written by {blog.postedBy.name} | Published{' '}
          {moment(blog.updatedAt).format('MMM DD, YYYY')}
        </p>
      </section>

      <section className='mb-3'>
        {showBlogCategories(blog)}
        {showBlogTags(blog)}
      </section>

      <div className='row'>
        <div className='col-md-4'>
          <section>
            <img
              className='img img-fluid'
              style={{ maxHeight: '250px', width: '100%', objectFit: 'cover' }}
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
  );
};

export default Card;
