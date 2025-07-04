import Layout from '../../../components/Layout';
import Link from 'next/link';
import Admin from '../../../components/auth/Admin';

const CategoryTag = () => {
  return (
    <Layout>
      <Admin>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-md-12 pt-5 pb-5'>
              <h2>Manage Categories and Tags</h2>
            </div>
            <div className='col-md-4'>
              <h4>Categories</h4>
              <ul class='list-group'>
                <li className='list-group-item'>
                  <Link href='/crud/category-tag'> </Link>
                </li>
              </ul>
            </div>
            <div className='col-md-8'>
              <p>tags here </p>
            </div>
          </div>
        </div>
      </Admin>
    </Layout>
  );
};

export default CategoryTag;
