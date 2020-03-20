import React, { useState, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';

function Ingredients() {
  const [ingredients, setIngredients] = useState([]);

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
    fetch(`https://react-hooks-tutorial-de828.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE'
    }).then(_ => {
      let newIngredients = ingredients.filter(ingredient => ingredient.id !== id);
      setIngredients(newIngredients);
    });
  }

  const onLoadFilteredIngredients = useCallback(
    (ingredients) => {
      setIngredients(ingredients);
    },
    [],
  )

  return (
    <div className="App">
      <IngredientForm addIngredientHandler={addIngredientHandler} />

      <section>
        <Search onLoadFilteredIngredients={onLoadFilteredIngredients} />
        <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
