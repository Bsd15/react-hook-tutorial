import { useReducer, useCallback } from 'react';

const httpReducer = (currentHttpState, action) => {
    switch (action.type) {
        case 'SEND':
            return { isLoading: true, error: null, data: null, extras: null, actionId: action.actionId };
        case 'RECIEVED':
            return { ...currentHttpState, isLoading: false, data: action.responseData, extras: action.extras };
        case 'ERROR':
            return { ...currentHttpState, isLoading: false, error: action.error };
        case 'CLEAR_ERROR':
            return { ...currentHttpState, error: null };
        default:
            throw Error(`${action.type} not dealt. Please check your action type or add it!`);
    }
};

const useHttp = () => {
    const [httpState, httpDispatch] = useReducer(httpReducer, { isLoading: false, error: null, data: null, extras: null, actionId: null });
    const sendRequest = useCallback((url, method, body, extras, actionId) => {
        httpDispatch({ type: 'SEND', actionId: actionId });
        fetch(url, {
            method: method,
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            return response.json();
        }).then(responseData => {
            httpDispatch({ type: 'RECIEVED', responseData: responseData, extras: extras });
        }).catch(error => {
            httpDispatch({ type: 'ERROR', error: 'SOMETHING WENT WRONG!!!' });
        });
    }, []);
    return {
        actionId: httpState.actionId,
        isLoading: httpState.isLoading,
        error: httpState.error,
        data: httpState.data,
        sendRequest: sendRequest,
        extras: httpState.extras
    };
};

export default useHttp;