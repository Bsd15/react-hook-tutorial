import React, { useState, useEffect, useRef } from 'react';
import useHttp from '../../hooks/http';
import Card from '../UI/Card';
import './Search.css';
import ErrorModal from '../UI/ErrorModal';

const Search = React.memo(props => {
  const [enteredFilterText, setEnteredFilterText] = useState('');
  const { onLoadFilteredIngredients } = props;
  const inputRef = useRef();
  const { isLoading, data, clear, error, sendRequest } = useHttp();
  useEffect(() => {
    const filterTimer = setTimeout(() => {
      if (enteredFilterText === inputRef.current.value) {
        const query = enteredFilterText.length === 0 ?
          '' :
          `?orderBy="title"&equalTo="${enteredFilterText}"`;

        sendRequest('https://react-hooks-tutorial-de828.firebaseio.com/ingredients.json' + query, 'GET');

        // fetch('https://react-hooks-tutorial-de828.firebaseio.com/ingredients.json' + query)
        //   .then(response => response.json())
        //   .then(responseData => {
        //     let fetchedIngredients = [];
        //     for (const ingredientKey in responseData) {
        //       fetchedIngredients.push({
        //         id: ingredientKey,
        //         title: responseData[ingredientKey].title,
        //         amount: responseData[ingredientKey].amount
        //       });
        //     }
        //     onLoadFilteredIngredients(fetchedIngredients);
        //   });
      }
    }, 500);
    return () => clearTimeout(filterTimer);
  }, [enteredFilterText, sendRequest, inputRef]);

  useEffect(() => {
    if (!isLoading && !error && data) {
      let fetchedIngredients = [];
      for (const ingredientKey in data) {
        fetchedIngredients.push({
          id: ingredientKey,
          title: data[ingredientKey].title,
          amount: data[ingredientKey].amount
        });
      }
      onLoadFilteredIngredients(fetchedIngredients);
    }

  }, [data, error, isLoading, onLoadFilteredIngredients])

  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <p>Loading...</p>}
          <input ref={inputRef} type="text" value={enteredFilterText} onChange={event => setEnteredFilterText(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
