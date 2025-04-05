import Layout from '../components/Layout';
import Link from 'next/link';

const Signup = () => {
  return (
    <Layout>
      <h2>Signup</h2>
      <Link href='/signin'>Already have an account? Signin</Link>
      <Link href='/'>Home</Link>
    </Layout>
  );
};

export default Signup;
