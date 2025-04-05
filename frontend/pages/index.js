import Layout from '../components/Layout';
import Link from 'next/link';

const Index = () => (
  <Layout>
    <h2>Index Page</h2>
    <Link href='/signin'>Signin</Link>
    <Link href='/signup'>Signup</Link>
  </Layout>
);

export default Index;
