import React from 'react';
import distanceInWordsToNow from 'date-fns/esm/formatDistanceToNow';
import LinkItem from './LinkItem';
import { FirebaseContext } from '../../firebase';

const LinkDetail = props => {
  // eslint-disable-next-line react/destructuring-assignment
  const { linkId } = props.match.params;
  const [link, setLink] = React.useState(null);
  const [commentText, setCommentText] = React.useState('');
  const { firebase, user } = React.useContext(FirebaseContext);
  const linkRef = firebase.db.collection('links').doc(linkId);

  React.useEffect(() => {
    const getLink = () => {
      linkRef.get().then(doc => {
        setLink({ ...doc.data(), id: doc.id });
      });
    };
    getLink();
  }, [firebase.db, linkId, linkRef]);

  const handleAddComment = () => {
    if (!user) {
      props.history.push('/');
    } else {
      linkRef.get().then(doc => {
        if (doc.exists) {
          const previousComments = doc.data().comments;
          const comment = {
            postedBy: { id: user.uid, name: user.displayName },
            created: Date.now(),
            text: commentText
          };
          const updatedComments = [...previousComments, comment];
          linkRef.update({ comments: updatedComments });
          setLink(prevState => ({
            ...prevState,
            comments: updatedComments
          }));
          setCommentText('');
        }
      });
    }
  };

  return !link ? (
    <div>Loading...</div>
  ) : (
    <div>
      <LinkItem showCount={false} link={link} />
      <textarea
        value={commentText}
        cols='60'
        rows='6'
        onChange={event => setCommentText(event.target.value)}
      />
      <div>
        <button className='button' onClick={handleAddComment} type='button'>
          Add comment
        </button>
        {link.comments.map((comment, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index}>
            <p className='comment-author'>
              {comment.postedBy.name} | {distanceInWordsToNow(comment.created)}
            </p>
            <p>{comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LinkDetail;
