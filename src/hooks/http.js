import { useReducer, useCallback } from 'react';

const httpReducer = (currentHttpState, action) => {
    switch (action.type) {
        case 'SEND':
            return { isLoading: true, error: null, data: null };
        case 'RECIEVED':
            return { ...currentHttpState, isLoading: false, data: action.responseData };
        case 'ERROR':
            return { ...currentHttpState, isLoading: false, error: action.error };
        case 'CLEAR_ERROR':
            return { ...currentHttpState, error: null };
        default:
            throw Error(`${action.type} not dealt. Please check your action type or add it!`);
    }
};

const useHttp = () => {
    const [httpState, httpDispatch] = useReducer(httpReducer, { isLoading: false, error: null, data: null });
    const sendRequest = useCallback((url, method, body) => {
        httpDispatch({ type: 'SEND' });
        fetch(url, {
            method: method,
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            return response.json();
        }).then(responseData => {
            httpDispatch({ type: 'RECIEVED', responseData: responseData });
        }).catch(error => {
            httpDispatch({ type: 'ERROR', error: 'SOMETHING WENT WRONG!!!' });
        });
    }, []);
    return {
        isLoading: httpState.isLoading,
        error: httpState.error,
        data: httpState.responseData,
        sendRequest: sendRequest
    };
};

export default useHttp;