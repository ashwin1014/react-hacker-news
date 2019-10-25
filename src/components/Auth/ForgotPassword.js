import React from 'react';
import FirebaseContext from '../../firebase/context';

const ForgotPassword = () => {
  const { firebase } = React.useContext(FirebaseContext);
  const [resetPasswordEmail, setResetPasswordEmail] = React.useState('');
  const [isPasswordReset, setIsPasswordReset] = React.useState(false);
  const [passwordResetError, setPasswordResetError] = React.useState(null);

  const handlePasswordReset = async () => {
    try {
      await firebase.resetPassword(resetPasswordEmail);
      setIsPasswordReset(true);
      setPasswordResetError(null);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error sending email', err);
      setPasswordResetError(err.message);
      setIsPasswordReset(false);
    }
  };
  return (
    <div>
      <input
        type='email'
        className='input'
        placeholder='Provide your account email'
        onChange={event => setResetPasswordEmail(event.target.value)}
      />
      <div>
        <button className='button' type='button' onClick={handlePasswordReset}>
          Reset Password
        </button>
      </div>
      {isPasswordReset && <p>Check email sent to reset password</p>}
      {passwordResetError && <p className='error-text'>{passwordResetError}</p>}
    </div>
  );
};

export default ForgotPassword;
