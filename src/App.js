import React, {Component, useContext, useEffect} from 'react';
import Map from './Components/Map';
import Stats from './Components/Stats';
import LayerPicker from './Components/LayerPicker';
import {Store} from './Store';
import './App.css';

export default function App(props) {
  const {state, dispatch} = useContext(Store);
  useEffect(()=>{
    fetch('/suffolk_county_wide_form.geojson').then(r=>r.json()).then((result)=>{
        dispatch({
            type:'UPDATE_FEATURES',
            payload: result
        })
        dispatch({
            type:"UPDATE_CANDIDATES",
            payload: Object.keys(result.features[0].properties).filter(a=> !['Void','region','district_no'].includes(a))
        })
    })
  },[])
  return (
    <div className="App">
      <Map />
      <Stats />
      <LayerPicker />
    </div>
  );
}
