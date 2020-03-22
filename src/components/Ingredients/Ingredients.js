import React, { useState, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

function Ingredients() {
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const clearError = () => {
    setError(null);
  }

  const addIngredientHandler = ingredient => {
    setIsLoading(true);
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
        setIsLoading(false);
      })
      .catch(error => {
        setError('Something went wrong!!!');
        setIsLoading(false);
      });
  };

  const removeIngredientHandler = id => {
    setIsLoading(true);
    fetch(`https://react-hooks-tutorial-de828.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE'
    }).then(_ => {
      let newIngredients = ingredients.filter(ingredient => ingredient.id !== id);
      setIngredients(newIngredients);
      setIsLoading(false);
    })
      .catch(error => {
        setError("Something went wrong!!!");
        setIsLoading(false);
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
      <IngredientForm
        addIngredientHandler={addIngredientHandler}
        isLoading={isLoading} />

      <section>
        <Search onLoadFilteredIngredients={onLoadFilteredIngredients} />
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
    </div>
  );
}

export default Ingredients;
