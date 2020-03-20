import React, { useState } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';

function Ingredients() {
  const [ingredients, setIngredients] = useState([]);

  const addIngredientHandler = ingredient => {
    setIngredients(prevIngredients => ([...prevIngredients, {
      id: Math.random().toString(),
      title: ingredient.title,
      amount: ingredient.amount
    }]));
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
