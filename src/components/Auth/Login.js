import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useFormValidation from '../../utils/useFormValidation';
import validateAuth from './validateLogin';
import firebase from '../../firebase';

const Login = ({ history }) => {
  const INITIAL_STATE = {
    name: '',
    email: '',
    password: ''
  };

  const [login, setLogin] = useState(true);
  // eslint-disable-next-line no-use-before-define
  const {
    handleSubmit,
    handleChange,
    values,
    handleBlur,
    errors,
    isSubmitting
    // eslint-disable-next-line no-use-before-define
  } = useFormValidation(INITIAL_STATE, validateAuth, authenticateUser);
  const [firebaseError, setFirebaseError] = useState(null);

  async function authenticateUser() {
    const { name, email, password } = values;
    try {
      // eslint-disable-next-line babel/no-unused-expressions
      login
        ? await firebase.login(email, password)
        : await firebase.register(name, email, password);
      history.push('/');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Authentication Error', err);
      setFirebaseError(err.message);
    }
  }

  return (
    <div>
      <h2 className='mv3'>{login ? 'Login' : 'Create Account'}</h2>
      <form className='flex flex-column' onSubmit={handleSubmit}>
        {!login ? (
          <>
            <input
              type='text'
              placeholder='Your name'
              className={errors.name && 'error-input '}
              autoComplete='off'
              name='name'
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {/* errors.name ? <p className='error-text'>{errors.email}</p> : null */}
          </>
        ) : null}
        <input
          type='email'
          className={errors.email && 'error-input'}
          placeholder='Your email'
          autoComplete='off'
          name='email'
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.email && <p className='error-text'>{errors.email}</p>}
        <input
          type='password'
          className={errors.password && 'error-input'}
          placeholder='Choose a secure password'
          name='password'
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.password && <p className='error-text'>{errors.password}</p>}
        {firebaseError && <p className='error-text'>{firebaseError}</p>}
        <div className='flex mt3'>
          <button
            type='submit'
            className='button pointer mr2'
            disabled={isSubmitting}
            style={{ background: isSubmitting ? 'grey' : 'orange' }}
          >
            Submit
          </button>
          <button
            type='button'
            className='pointer button'
            onClick={() => setLogin(prev => !prev)}
          >
            {login
              ? 'need to create an account ?'
              : 'already have an account ? '}
          </button>
        </div>
      </form>
      <div className='forgot-password'>
        <Link to='/forgot'>Forgot password ?</Link>
      </div>
    </div>
  );
};

export default Login;
