import React, {useStore, useReducer, useEffect, createContext} from 'react';

const initalState = {
  electionResults: null,
  candidates: null,
  selectedCandidate: null,
  hoverFeature: null,
  selectedRegion: null,
  basemap: 'satelite',
  showWinner: true,
};

const reducer = (state, action) => {
  const {type, payload} = action;
  switch (type) {
    case 'UPDATE_CANDIDATES':
      return {
        ...state,
        candidates: payload,
      };
    case 'UPDATE_FEATURES':
      return {
        ...state,
        electionResults: payload,
      };
    case 'SELECT_CANDIDATE':
      return {
        ...state,
        selectedCandidate: payload,
        shoWinner: false,
      };
    case 'SELECT_BASEMAP':
      return {
        ...state,
        basemap: payload,
      };
    case 'SET_SELECTED_REGION':
      return {
        ...state,
        selectedRegion: payload,
      };
    case 'SHOW_WINNER':
      return {
        ...state,
        showWinner: true,
      };
    case 'RESTORE_STATE':
      return {...state, ...payload};
    default:
      return state;
  }
};

export const Store = React.createContext();

export const StoreProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initalState);
  const value = {state, dispatch};

  useEffect(() => {
    const oldState = localStorage.getItem('store');
    if (oldState) {
      //dispatch({
      //type: 'RESTORE_STATE',
      //payload: JSON.parse(oldState),
      //});
    }
  }, []);

  useEffect(() => {
    //localStorage.setItem('store', JSON.stringify(state));
  }, [state]);

  return <Store.Provider value={value}>{children}</Store.Provider>;
};
