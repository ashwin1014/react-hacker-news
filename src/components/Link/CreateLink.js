import React from 'react';
import useFormValidation from '../../utils/useFormValidation';
import validateCreateLink from '../Auth/validateCreateLink';
import { FirebaseContext } from '../../firebase';

const INIT_STATE = {
  description: '',
  url: ''
};

const CreateLink = ({ history }) => {
  const { firebase, user } = React.useContext(FirebaseContext);

  const { handleSubmit, handleChange, values, errors } = useFormValidation(
    INIT_STATE,
    validateCreateLink,
    // eslint-disable-next-line no-use-before-define
    handleCreateLink
  );

  function handleCreateLink() {
    if (!user) {
      history.push('/login');
    } else {
      const { url, description } = values;
      const newLink = {
        url,
        description,
        postedBy: {
          id: user.uid,
          name: user.displayName
        },
        voteCount: 0,
        votes: [],
        comments: [],
        created: Date.now()
      };
      firebase.db.collection('links').add(newLink);
      history.push('/');
    }
  }

  return (
    <form className='flex flex-column mt3' onSubmit={handleSubmit}>
      <input
        type='text'
        value={values.description}
        name='description'
        placeholder='A description for your link'
        autoComplete='off'
        onChange={handleChange}
        className={errors.description && 'error-input'}
      />
      {errors.description && <p className='error-text'>{errors.description}</p>}
      <input
        type='url'
        value={values.url}
        name='url'
        placeholder='URL for the link'
        autoComplete='off'
        onChange={handleChange}
        className={errors.url && 'error-input'}
      />
      {errors.url && <p className='error-text'>{errors.url}</p>}
      <button className='button' type='submit'>
        Submit
      </button>
    </form>
  );
};

export default CreateLink;
