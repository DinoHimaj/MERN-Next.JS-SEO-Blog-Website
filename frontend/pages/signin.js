import Layout from '../components/Layout';
import Link from 'next/link';

const Singin = () => {
  return (
    <Layout>
      <h2>Signin</h2>
      <Link href='/signup'>Signup</Link>
      <Link href='/'>Home</Link>
    </Layout>
  );
};

export default Singin;
