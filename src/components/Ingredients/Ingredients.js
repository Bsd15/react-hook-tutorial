import React, { useCallback, useReducer, useMemo } from 'react';
import useHttp from '../../hooks/http';
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
};

function Ingredients() {
  const [ingredients, ingredientsDispatch] = useReducer(ingredientsReducer, []);

  const { isLoading, error, data, sendRequest } = useHttp();


  const clearError = () => {
    // httpDispatch({ type: 'CLEAR_ERROR' });
  }

  const addIngredientHandler = useCallback(ingredient => {
    // httpDispatch({ type: 'SEND' });
    // fetch('https://react-hooks-tutorial-de828.firebaseio.com/ingredients.json', {
    //   method: 'POST',
    //   body: JSON.stringify(ingredient),
    //   headers: { 'Content-Type': 'application/json' }
    // }).then(response => response.json())
    //   .then(responseData => {
    //     ingredientsDispatch({
    //       type: 'ADD', newIngredient: {
    //         id: responseData.name,
    //         title: ingredient.title,
    //         amount: ingredient.amount
    //       }
    //     });
    //     httpDispatch({ type: 'RECIEVED' });
    //   })
    //   .catch(error => {
    //     httpDispatch({ type: 'ERROR', error: 'SOMETHING WENT WRONG!!!' });
    //   });
  }, []);

  const removeIngredientHandler = useCallback(id => {
    // httpDispatch({ type: 'SEND' });
    // fetch(`https://react-hooks-tutorial-de828.firebaseio.com/ingredients/${id}.json`, {
    //   method: 'DELETE'
    // }).then(_ => {
    //   ingredientsDispatch({ type: 'DELETE', ingredientID: id });
    //   httpDispatch({ type: 'RECIEVED' });
    // })
    //   .catch(error => {
    //     httpDispatch({ type: 'ERROR', error: 'SOMETHING WENT WRONG!!!' });
    //   });
    sendRequest(`https://react-hooks-tutorial-de828.firebaseio.com/ingredients/${id}.json`, 'DELETE');
  }, [sendRequest]);

  const onLoadFilteredIngredients = useCallback(
    (ingredients) => {
      ingredientsDispatch({ type: 'SET', ingredients: ingredients });
    },
    [],
  );

  const ingredientsList = useMemo(() => <IngredientList
    ingredients={ingredients}
    onRemoveItem={removeIngredientHandler}
  />, [ingredients, removeIngredientHandler]);

  return (
    <div className="App">
      <IngredientForm
        addIngredientHandler={addIngredientHandler}
        isLoading={isLoading} />

      <section>
        <Search onLoadFilteredIngredients={onLoadFilteredIngredients} />
        {ingredientsList}
      </section>
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
    </div>
  );
}

export default Ingredients;
