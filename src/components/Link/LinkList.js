import React, { useContext, useEffect, useState } from 'react';
import LinkItem from './LinkItem';
import { FirebaseContext } from '../../firebase';

const LinkList = ({ location }) => {
  const { firebase } = useContext(FirebaseContext);
  const [linkList, setLinks] = useState([]);
  const isNewPage = location.pathname.includes('new');

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
      firebase.db
        .collection('links')
        .orderBy('created', 'desc')
        .onSnapshot(handleSnapshot);
    };
    getLinks();
  }, [firebase.db]);

  const renderLinks = () => {
    if (isNewPage) return linkList;
    const topLinks = linkList
      .slice()
      .sort((l1, l2) => l2.votes.length - l1.votes.length);
    return topLinks;
  };

  return (
    <div>
      {renderLinks().map((link, index) => (
        <LinkItem key={link.id} showCount link={link} index={index + 1} />
      ))}
    </div>
  );
};

export default LinkList;
