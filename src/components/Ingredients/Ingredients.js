import React, { useCallback, useEffect, useReducer, useMemo } from 'react';
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

  const { actionId, isLoading, error, data, sendRequest, extras } = useHttp();

  useEffect(() => {
    if (!isLoading && !error && actionId === 'ADD_INGREDIENT') {
      ingredientsDispatch({
        type: 'ADD',
        newIngredient: {
          id: data.name,
          title: extras.title,
          amount: extras.amount
        }
      });
    } else if (!isLoading && !error && actionId === 'DELETE_INGREDIENT') {
      ingredientsDispatch({ type: 'DELETE', ingredientID: extras });
    }
  }, [data, extras, actionId, isLoading, error]);


  const clearError = () => {
    // httpDispatch({ type: 'CLEAR_ERROR' });
  }

  const addIngredientHandler = useCallback(ingredient => {
    sendRequest(
      'https://react-hooks-tutorial-de828.firebaseio.com/ingredients.json',
      'POST',
      ingredient,
      ingredient,
      'ADD_INGREDIENT'
    );
  }, [sendRequest]);

  const removeIngredientHandler = useCallback(id => {
    sendRequest(
      `https://react-hooks-tutorial-de828.firebaseio.com/ingredients/${id}.json`,
      'DELETE',
      null,
      id,
      'DELETE_INGREDIENT');
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
