import React, { useState } from 'react';
import Link from 'next/link';
import { APP_NAME } from '../config';
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
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default Header;
