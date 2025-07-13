import Layout from '../../components/Layout';
import Link from 'next/link';
import Admin from '../../components/auth/Admin';

const AdminIndex = () => {
  return (
    <Layout>
      <Admin>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-md-12 pt-5 pb-5'>
              <h2>Admin Dashboard</h2>
            </div>
            <div className='col-md-4'>
              <ul className='list-group'>
                <li className='list-group-item'>
                  <Link href='/admin/crud/category-tag'>
                    📁 Manage Categories
                  </Link>
                </li>
              </ul>
            </div>
            <div className='col-md-8'>
              <ul className='list-group'>
                <li className='list-group-item'>
                  <Link href='/admin/crud/category-tag'>🏷️ Manage Tags</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Admin>
    </Layout>
  );
};

export default AdminIndex;
