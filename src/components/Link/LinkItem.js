import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import distanceInWordsToNow from 'date-fns/esm/formatDistanceToNow';
import { getDomain } from '../../utils/index';
import { FirebaseContext } from '../../firebase';

const LinkItem = ({ link, index, showCount, history }) => {
  const { firebase, user } = React.useContext(FirebaseContext);

  const handleVote = () => {
    if (!user) {
      history.push('/login');
    } else {
      const voteRef = firebase.db.collection('links').doc(link.id);
      voteRef.get().then(doc => {
        if (doc.exists) {
          const previousVotes = doc.data().votes;
          const vote = { votedBy: { id: user.uid, name: user.displayName } };
          const updatedVotes = [...previousVotes, vote];
          voteRef.update({ votes: updatedVotes });
        }
      });
    }
  };

  const handleDeleteLink = () => {
    const linkRef = firebase.db.collection('links').doc(link.id);
    linkRef
      .delete()
      .then(() => {
        // eslint-disable-next-line no-console
        console.log(`Document with ID ${link.id} deleted`);
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error(err);
      });
  };

  const handleKeyPress = (event, type) => {
    if (event.key === 'Enter') {
      if (type === 'vote') handleVote();
      if (type === 'del') handleDeleteLink();
    }
  };

  const postedByAuthUser = user && user.uid === link.postedBy.id;

  return (
    <div className='flex items-start mt2'>
      <div className='flex items-center'>
        {showCount && <span className='gray'>{index}</span>}
        <div
          className='vote-button pointer'
          onClick={handleVote}
          onKeyPress={e => handleKeyPress(e, 'vote')}
          role='button'
          tabIndex={0}
        >
          &#9650;
        </div>
      </div>
      <div className='ml1'>
        {link.description} <span className='link'>({getDomain(link.url)})</span>
      </div>
      <div className='f6 lg-copy gray'>
        &nbsp;{link.votes.length} votes by {link.postedBy.name}{' '}
        {distanceInWordsToNow(link.created)}
        {' | '}
        <Link to={`/link/${link.id}`}>
          {link.comments.length > 0
            ? `${link.comments.length} comments`
            : 'discuss'}
        </Link>
        {postedByAuthUser && (
          <>
            |
            <span
              className='delete-button'
              onClick={handleDeleteLink}
              onKeyPress={e => handleKeyPress(e, 'del')}
              role='button'
              tabIndex={0}
            >
              delete
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default withRouter(LinkItem);
