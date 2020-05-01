import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Collection, CollectionItem, Icon } from 'react-materialize';
import snipsAPI from '../../utils/snipsAPI';
import usersAPI from '../../utils/usersAPI';

function Feed() {
  const [userState, setUserState] = useState(null);
  const [snipState, setSnipState] = useState(null);
  const [language, setLanguage] = useState('javascript')  // Get from context or prop. Should be a single string.
  const [keywords, setKeywords] = useState(null);         // Get from context or prop. Should be an array of words.

  async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  useEffect(() => {
    async function fetchData() {
      let { data } = await snipsAPI.getSnips();
      let snips = data;
      let users = [];
      
      // Get snips and filter them if needed.
      if (language) { snips = snips.filter(snip => snip.language === language); }
      if (keywords) {
        snips = snips.filter(snip => {
          const snipWords = snip.body.split(' ');
          const found = snipWords.some(word => keywords.includes(word));

          return found;
        });
      }
      // Get users for each snip.
      snips = snips.splice(0, 10);
      await asyncForEach(snips, async (snip) => {
        const response = await usersAPI.getUser(snip.userId)
        users.push(response.data);
      });

      setSnipState(snips);
      setUserState(users);
    }
    fetchData();

  }, [language, keywords]);

  function renderSnips() {
    return (
      <>
        {snipState.map(snip => {
          let user;
          if (userState) { user = userState.find(user => user._id === snip.userId) };

          return(
            <Collection>
              <CollectionItem className='avatar'>
                <Row>
                  <Col s={1}>
                    <img alt='Avatar' className='circle' src={(userState) ? user.imageUrl : 'https://picsum.photos/200'} />
                  </Col>
                  <Col s={9}>
                    <span className='title'>{snip.body}</span>
                  </Col>
                  <Col s={2}>
                    <Link to={`/snips/${snip._id}`} className='secondary-content'><Icon>See Snip</Icon></Link>
                  </Col>
                </Row>
              </CollectionItem>
            </Collection>
          );
        })}
      </>
    );
  }

  return (
    <Row>
      <Col s={12} m={6} offset='m3'>
        {(snipState) ? renderSnips() : <p>No tips for these snips.</p>}
      </Col>
    </Row>
  );
}

export default Feed;