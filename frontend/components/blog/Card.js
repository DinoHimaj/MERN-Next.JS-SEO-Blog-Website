import Link from 'next/link';
import moment from 'moment';
import { API } from '../../config';

const Card = ({ blog }) => {
  const showBlogCategories = (b) =>
    b?.categories?.map((c, i) => (
      <Link key={i} href={`/categories/${c.slug}`} className='badge-category'>
        {c.name}
      </Link>
    ));

  const showBlogTags = (b) =>
    b?.tags?.map((t, i) => (
      <Link key={i} href={`/tags/${t.slug}`} className='badge-tag'>
        #{t.name}
      </Link>
    ));

  return (
    <div className='card blog-card'>
      <div className='row g-0'>
        <div className='col-md-4'>
          <div className='blog-card-image-wrapper'>
            <img
              className='blog-card-image'
              src={`${API}/blog/photo/${blog.slug}`}
              alt={blog.title}
            />
          </div>
        </div>

        <div className='col-md-8'>
          <div className='card-body p-4'>
            <Link
              href={`/blogs/${blog.slug}`}
              style={{ textDecoration: 'none' }}
            >
              <h2 className='blog-card-title h3'>{blog.title}</h2>
            </Link>

            <div className='blog-card-meta mb-3'>
              <span className='blog-card-author'>{blog.postedBy.name}</span>
              <span className='mx-2'>•</span>
              {moment(blog.updatedAt).format('MMM DD, YYYY')}
              <span className='mx-2'>•</span>
              {moment(blog.updatedAt).fromNow()}
            </div>

            <div className='mb-3'>
              {showBlogCategories(blog)}
              {showBlogTags(blog)}
            </div>

            <p className='blog-card-excerpt'>{blog.excerpt}</p>

            <Link
              href={`/blogs/${blog.slug}`}
              className='btn btn-primary btn-read-more'
            >
              Read Article →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
