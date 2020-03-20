import React, { useState, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';

function Ingredients() {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    fetch('https://react-hooks-tutorial-de828.firebaseio.com/ingredients.json')
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
      setIngredients(fetchedIngredients);
    });
  }, []);

  const addIngredientHandler = ingredient => {

    fetch('https://react-hooks-tutorial-de828.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => response.json())
      .then(responseData => {
        console.log(responseData);
        setIngredients(prevIngredients => ([...prevIngredients, {
          id: responseData.name,
          title: ingredient.title,
          amount: ingredient.amount
        }]));
      });
  };

  const removeIngredientHandler = id => {
    let newIngredients = ingredients.filter(ingredient => ingredient.id !== id);
    setIngredients(newIngredients);
  }

  return (
    <div className="App">
      <IngredientForm addIngredientHandler={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
