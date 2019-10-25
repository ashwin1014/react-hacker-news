import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import './Header.scss';
import Logo from '../../assets/images/logo.png';
import { FirebaseContext } from '../../firebase';

const Header = () => {
  const { user, firebase } = React.useContext(FirebaseContext);
  return (
    <div className='header'>
      <div className='flex'>
        <img src={Logo} alt='Hooks news Logo' className='logo' />
        <NavLink to='/' className='header-title'>
          Hooks News
        </NavLink>
        <NavLink to='/' className='header-link'>
          New
        </NavLink>
        <div className='divider'>|</div>
        <NavLink to='/top' className='header-link'>
          Top
        </NavLink>
        <div className='divider'>|</div>
        <NavLink to='/search' className='header-link'>
          Search
        </NavLink>
        {user && (
          <>
            <div className='divider'>|</div>
            <NavLink to='/create' className='header-link'>
              Submit
            </NavLink>
          </>
        )}
      </div>
      <div className='flex'>
        {user ? (
          <>
            <div className='header-name'>{user.displayName}</div>
            <div className='divider'>|</div>
            <div
              className='header-button'
              onKeyPress={() => firebase.logout()}
              onClick={() => firebase.logout()}
              role='button'
              tabIndex={0}
            >
              logout
            </div>
          </>
        ) : (
          <NavLink to='/login' className='header-link'>
            Login
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default withRouter(Header);
