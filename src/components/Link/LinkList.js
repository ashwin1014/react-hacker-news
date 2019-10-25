import React, { useContext, useEffect, useState } from 'react';
import LinkItem from './LinkItem';
import { FirebaseContext } from '../../firebase';

const LinkList = () => {
  const { firebase } = useContext(FirebaseContext);
  const [linkList, setLinks] = useState([]);

  const handleSnapshot = snapshop => {
    const links = snapshop.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      };
    });
    setLinks(links);
  };

  useEffect(() => {
    const getLinks = () => {
      firebase.db.collection('links').onSnapshot(handleSnapshot);
    };
    getLinks();
  }, [firebase.db]);

  return (
    <div>
      {linkList.map((link, index) => (
        <LinkItem key={link.id} showCount link={link} index={index + 1} />
      ))}
    </div>
  );
};

export default LinkList;
