import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import NProgress from 'nprogress';
import { APP_NAME } from '../config';
import Router from 'next/router';
import { signout, isAuth } from '../actions/auth';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';

Router.onRouteChangeStart = (url) => NProgress.start();
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = (url) => NProgress.done();

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [auth, setAuth] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatches by only showing auth-dependent content after mounting
  useEffect(() => {
    setMounted(true);
    setAuth(isAuth());
  }, []);

  const toggle = () => setIsOpen(!isOpen);

  // Don't render auth-dependent content until component is mounted
  if (!mounted) {
    return (
      <Navbar color='light' light expand='md' container>
        <Link href='/' className='navbar-brand font-weight-bold'>
          {APP_NAME}
        </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className='ms-auto' navbar>
            {/* Show loading state or minimal content */}
          </Nav>
        </Collapse>
      </Navbar>
    );
  }

  return (
    <Navbar color='light' light expand='md' container>
      <Link href='/' className='navbar-brand font-weight-bold'>
        {APP_NAME}
      </Link>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className='ms-auto' navbar>
          {!auth && (
            <>
              <NavItem>
                <Link href='/signin' passHref legacyBehavior>
                  <NavLink>Sign In</NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <Link href='/signup' passHref legacyBehavior>
                  <NavLink>Signup</NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <Link href='/blogs' passHref legacyBehavior>
                  <NavLink>Blogs</NavLink>
                </Link>
              </NavItem>
            </>
          )}

          {auth && (
            <NavItem>
              <NavLink
                href='#'
                onClick={(e) => {
                  e.preventDefault();
                  signout(() => Router.replace('/signin'));
                }}
                style={{ cursor: 'pointer' }}
              >
                Signout
              </NavLink>
            </NavItem>
          )}

          {auth && auth.role === 0 && (
            <NavItem>
              <Link href='/user' passHref legacyBehavior>
                <NavLink>{auth.name}'s Dashboard</NavLink>
              </Link>
            </NavItem>
          )}

          {auth && auth.role === 1 && (
            <NavItem>
              <Link href='/admin' passHref legacyBehavior>
                <NavLink>{auth.name}'s Dashboard</NavLink>
              </Link>
            </NavItem>
          )}
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default Header;
