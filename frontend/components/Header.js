import React, { useState } from 'react';
import Link from 'next/link';
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

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <Navbar color='light' light expand='md' container>
      <Link href='/' className='navbar-brand font-weight-bold'>
        {APP_NAME}
      </Link>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className='ms-auto' navbar>
          {!isAuth() && (
            <>
              <NavItem>
                <Link href='/signin' className='nav-link'>
                  Sign In
                </Link>
              </NavItem>
              <NavItem>
                <Link href='/signup' className='nav-link'>
                  Signup
                </Link>
              </NavItem>
            </>
          )}

          {isAuth() && (
            <NavItem>
              <NavLink
                style={{ cursor: 'pointer' }}
                onClick={() => signout(() => Router.replace('/signin'))}
                className='nav-link'
              >
                Signout
              </NavLink>
            </NavItem>
          )}

          {isAuth() && isAuth().role === 0 && (
            <NavItem>
              <Link href='/user' className='nav-link'>
                <NavLink>{isAuth().name}'s Dashboard </NavLink>
              </Link>
            </NavItem>
          )}

          {isAuth() && isAuth().role === 1 && (
            <NavItem>
              <Link href='/admin' className='nav-link'>
                <NavLink>{isAuth().name}'s Dashboard</NavLink>
              </Link>
            </NavItem>
          )}
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default Header;
