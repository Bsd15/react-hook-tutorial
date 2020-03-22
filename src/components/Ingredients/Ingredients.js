import React, { useCallback, useReducer } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

const ingredientsReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.newIngredient];
    case 'DELETE':
      return currentIngredients.filter(ingredient => action.ingredientID !== ingredient.id);
    default:
      throw Error(`${action.type} not dealt. Please check your action type or add it!`);
  }
}

const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { isLoading: true, error: null };
    case 'RECIEVED':
      return { ...currentHttpState, isLoading: false };
    case 'ERROR':
      return { isLoading: false, error: action.error };
    case 'CLEAR_ERROR':
      return { ...currentHttpState, error: null };
    default:
      throw Error(`${action.type} not dealt. Please check your action type or add it!`);
  }
}

function Ingredients() {
  const [ingredients, ingredientsDispatch] = useReducer(ingredientsReducer, []);
  const [httpState, httpDispatch] = useReducer(httpReducer, { isLoading: false, error: null });

  const clearError = () => {
    httpDispatch({ type: 'CLEAR_ERROR' });
  }

  const addIngredientHandler = ingredient => {
    httpDispatch({ type: 'SEND' });
    fetch('https://react-hooks-tutorial-de828.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => response.json())
      .then(responseData => {
        ingredientsDispatch({
          type: 'ADD', newIngredient: {
            id: responseData.name,
            title: ingredient.title,
            amount: ingredient.amount
          }
        });
        httpDispatch({ type: 'RECIEVED' });
      })
      .catch(error => {
        httpDispatch({ type: 'ERROR', error: 'SOMETHING WENT WRONG!!!' });
      });
  };

  const removeIngredientHandler = id => {
    httpDispatch({ type: 'SEND' });
    fetch(`https://react-hooks-tutorial-de828.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE'
    }).then(_ => {
      ingredientsDispatch({ type: 'DELETE', ingredientID: id });
      httpDispatch({ type: 'RECIEVED' });
    })
      .catch(error => {
        httpDispatch({ type: 'ERROR', error: 'SOMETHING WENT WRONG!!!' });
      });
  }

  const onLoadFilteredIngredients = useCallback(
    (ingredients) => {
      ingredientsDispatch({ type: 'SET', ingredients: ingredients });
    },
    [],
  )

  return (
    <div className="App">
      <IngredientForm
        addIngredientHandler={addIngredientHandler}
        isLoading={httpState.isLoading} />

      <section>
        <Search onLoadFilteredIngredients={onLoadFilteredIngredients} />
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
    </div>
  );
}

export default Ingredients;
