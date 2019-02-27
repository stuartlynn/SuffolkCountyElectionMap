import React, {useContext} from 'react';
import {Store} from '../Store';

export default function LayerPicker(props) {
  const {state, dispatch} = useContext(Store);
  const {candidates, selectedCandidate,basemap} = state;
  console.log('state ', state, ' candidates ', candidates);
  return (
    <div className="LayerPicker">
        <p>Basemap</p>
        <hr />
      <ul>
        <li
          onClick={() =>
            dispatch({type: 'SELECT_BASEMAP', payload: 'satelite'})
          }
          style={basemap=='satelite' ? {fontWeight : 'bold'}: {}}
        >
          Satelite
        </li>
        <li
          onClick={() =>
            dispatch({type: 'SELECT_BASEMAP', payload: 'streets'})
          }
          style={basemap=='streets' ? {fontWeight : 'bold'}: {}}
        >
          Streets
        </li>
      </ul>
      <br />
        <p>Candidates</p>
        <hr />
      {candidates && (
        <ul>
          {candidates.map(c => (
            <li
              onClick={() => dispatch({type: 'SELECT_CANDIDATE', payload: c})}
              key={c}
              style={c == selectedCandidate ? {fontWeight: 'bold'} : {}}>
              {c}
            </li>
          ))}
        </ul>
      )}
        <p>Other</p>
        <hr />
        <ul>
            <li onClick={()=>dispatch({type: 'SELECT_WINNER'})}>Winner</li>
        </ul>
    </div>
  );
}
