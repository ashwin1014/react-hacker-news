import React, { useState, useContext, useEffect } from 'react';
import LinkItem from './LinkItem';
import { FirebaseContext } from '../../firebase';

const SearchLinks = () => {
  const [filter, setFilter] = useState('');
  const [filteredLinks, setFilteredLinks] = useState([]);
  const [linkList, setLinks] = useState([]);
  const { firebase } = useContext(FirebaseContext);

  useEffect(() => {
    const getInitialLinks = () => {
      firebase.db
        .collection('links')
        .get()
        .then(snapshot => {
          const links = snapshot.docs.map(doc => {
            return {
              id: doc.id,
              ...doc.data()
            };
          });
          setLinks(links);
        });
    };
    getInitialLinks();
  }, [firebase.db]);

  const handleSearch = event => {
    event.preventDefault();
    const query = filter.toLowerCase();
    const matchedLinks = linkList.filter(link => {
      return (
        link.description.toLowerCase().includes(query) ||
        link.url.toLowerCase().includes(query) ||
        link.postedBy.name.toLowerCase().includes(query)
      );
    });
    setFilteredLinks(matchedLinks);
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <div>
          Search{' '}
          <input
            type='text'
            onChange={event => setFilter(event.target.value)}
          />
          <button type='submit'>OK</button>
        </div>
      </form>
      {filteredLinks.map((filteredLink, index) => (
        <LinkItem
          key={filteredLink.id}
          showCount={false}
          link={filteredLink}
          index={index}
        />
      ))}
    </div>
  );
};

export default SearchLinks;
