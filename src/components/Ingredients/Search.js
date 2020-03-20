import React, { useState, useEffect } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const [enteredFilterText, setEnteredFilterText] = useState('');
  const { onLoadFilteredIngredients } = props;
  useEffect(() => {
    const query = enteredFilterText.length === 0 ?
      '' :
      `?orderBy="title"&equalTo="${enteredFilterText}"`;
    fetch('https://react-hooks-tutorial-de828.firebaseio.com/ingredients.json' + query)
      .then(response => response.json())
      .then(responseData => {
        let fetchedIngredients = [];
        for (const ingredientKey in responseData) {
          fetchedIngredients.push({
            id: ingredientKey,
            title: responseData[ingredientKey].title,
            amount: responseData[ingredientKey].amount
          });
        }
        onLoadFilteredIngredients(fetchedIngredients);
      });
  }, [enteredFilterText, onLoadFilteredIngredients])
  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input type="text" value={enteredFilterText} onChange={event => setEnteredFilterText(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
