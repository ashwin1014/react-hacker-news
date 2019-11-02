/* eslint-disable no-else-return */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/destructuring-assignment */
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import LinkItem from './LinkItem';
import { FirebaseContext } from '../../firebase';
import { LINKS_PER_PAGE } from '../../utils/index';

const LinkList = props => {
  const { firebase } = useContext(FirebaseContext);
  const [linkList, setLinks] = useState([]);
  const [cursor, setcursor] = React.useState(null);
  const [loader, setLoader] = React.useState(false);
  const isNewPage = props.location.pathname.includes('new');
  const isTopPage = props.location.pathname.includes('top');
  const page = Number(props.match.params.page);
  const linksRef = firebase.db.collection('links');

  const handleSnapshot = snapshop => {
    const links = snapshop.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      };
    });
    setLinks(links);
    const lastLink = links[links.length - 1];
    setcursor(lastLink);
    setLoader(false);
  };

  useEffect(() => {
    // eslint-disable-next-line consistent-return
    const getLinks = () => {
      const hasCursor = Boolean(cursor);
      setLoader(true);
      if (isTopPage) {
        return linksRef
          .orderBy('voteCount', 'desc')
          .limit(LINKS_PER_PAGE)
          .onSnapshot(handleSnapshot);
      } else if (page === 1) {
        return linksRef
          .orderBy('created', 'desc')
          .limit(LINKS_PER_PAGE)
          .onSnapshot(handleSnapshot);
      } else if (hasCursor) {
        return linksRef
          .orderBy('created', 'desc')
          .startAfter(cursor.created)
          .limit(LINKS_PER_PAGE)
          .onSnapshot(handleSnapshot);
      } else {
        const offset = page * LINKS_PER_PAGE - LINKS_PER_PAGE;
        axios
          .get(
            `https://us-central1-react-hacker-news-d7539.cloudfunctions.net/linksPagination?offset=${offset}`
          )
          .then(response => {
            const links = response.data;
            const lastLink = links[links.length - 1];
            setLinks(links);
            setcursor(lastLink);
            setLoader(false);
          });
        return () => {};
      }
    };
    const unSubscribe = getLinks();
    return () => unSubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTopPage, page]);

  // const renderLinks = () => {
  //   if (isNewPage) return linkList;
  //   const topLinks = linkList
  //     .slice()
  //     .sort((l1, l2) => l2.votes.length - l1.votes.length);
  //   return topLinks;
  // };

  const visitPrevPage = () => {
    if (page > 1) {
      props.history.push(`/new/${page - 1}`);
    }
  };

  const visitNextPage = () => {
    if (page <= linkList.length / LINKS_PER_PAGE) {
      props.history.push(`/new/${page + 1}`);
    }
  };

  const pageIndex = page ? (page - 1) * LINKS_PER_PAGE + 1 : 0;
  return (
    <div>
      {loader ? 'Loading...' : null}
      {linkList.map((link, index) => (
        <LinkItem
          key={link.id}
          showCount
          link={link}
          index={index + pageIndex}
        />
      ))}
      {isNewPage && (
        <div className='pagination'>
          <div
            className='pointer mr2'
            onClick={visitPrevPage}
            role='button'
            tabIndex='0'
          >
            Prev
          </div>
          <div
            className='pointer'
            onClick={visitNextPage}
            role='button'
            tabIndex='0'
          >
            Next
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkList;
