import React, {Component, useContext, useEffect, useRef} from 'react';

import 'ol/ol.css';
import * as extent from 'ol/extent';
import * as proj from 'ol/proj';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import BingMaps from 'ol/source/BingMaps.js';
import MVT from 'ol/format/MVT.js';
import Draw from 'ol/interaction/Draw.js';
import Select from 'ol/interaction/Select.js';
import Condition from 'ol/events/condition.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import Overlay from 'ol/Overlay.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import VectorTileLayer from 'ol/layer/VectorTile.js';
import VectorTileSource from 'ol/source/VectorTile.js';
import {Fill, Stroke, Style} from 'ol/style.js';
import {fromLonLat} from 'ol/proj';
import TopoJSON from 'ol/format/TopoJSON.js';
import {Store} from '../Store';
import {scaleOrdinal,schemeBlues,interpolatePurples} from 'd3'

export default function MapContainer(props) {
  const {state, dispatch} = useContext(Store);
  const {electionResults, selectedCandidate, basemap, showWinner} = state

  const satLayer = useRef(null);
  const osmLayer = useRef(null);
  const electionSource= useRef(null);
  const electionLayer = useRef(null);


  const map = useRef(null);
  const mapDiv = useRef(null);

  const voteFractionScale = useRef(interpolatePurples);

  const setupMap = () => {
    satLayer.current = new TileLayer({
      visible: true,
      name: 'satellite',
      source: new BingMaps({
        key: 'AgLzlnwMj2gShi2VFvfbzU4z3uuSwE6Fjlp9OakfGJub-c6s9Q4WG3g4nrRQkV6s',
        imagerySet: 'Aerial',
      }),
    });

    osmLayer.current = new TileLayer({
      visible: false,
      name: 'osm',
      source: new OSM(),
    });

    map.current = new Map({
      target: mapDiv.current,
      layers: [satLayer.current, osmLayer.current],
      view: new View({
        center: fromLonLat([-73.273175, 40.818746]),
        zoom: 10,
      }),
    });

    map.current.on('click',(evt)=>{
        map.current.forEachFeatureAtPixel(evt.pixel, (feature)=>{
            const properties = feature.getProperties()
            console.log('selected feature ', feature, properties)
            dispatch({
                type: 'SET_SELECTED_REGION',
                payload: { region: properties.region, district_no : properties.district_no}
            })
        })
    })
  };

  const styleFunction = (candidate) => (feature)=>{
    const properties  = feature.getProperties()
    const voteFrac  = properties[selectedCandidate]
    return new Style({
        stroke: new Stroke({
            color:'grey',
            width: 0.1
        }),
        fill: new Fill({
            color: voteFrac==0 ? 'rgba(0,0,0,0.2)' : interpolatePurples(1-voteFrac),
        })
    })
  }

  useEffect((()=>{
    if(electionLayer.current){
        electionLayer.current.setStyle(styleFunction(selectedCandidate))
    }
  }),[selectedCandidate])

  useEffect(()=>{
    if(electionResults ){
        electionSource.current = new VectorSource({
            features:(new GeoJSON()).readFeatures(electionResults, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            })
        })

        //electionSource.current = new VectorSource({
            //url:'/suffolk_county_wide_form.topojson',
            //format: new TopoJSON({
                //overlaps:false,
                //layers:['suffolk_county_wide_form']
            //})
        //})

        electionLayer.current = new VectorLayer({
            source: electionSource.current,
            style: styleFunction(),
            visible:true
        });

        map.current.addLayer(electionLayer.current)
    }
  },[electionResults])

  useEffect(()=>{
    console.log("updating basemap ", basemap)
    if(satLayer.current && osmLayer.current){
        satLayer.current.setVisible(basemap=='satelite')
        osmLayer.current.setVisible(basemap!='satelite')
    }
  },[basemap])

  useEffect(() => {
    setupMap();
    window.addEventListener('resize', () => {
      console.log('resizing map ')
      setTimeout(() => map.current.updateSize(), 200);
    });
    setTimeout(() => map.current.updateSize(), 200);
  }, []);

  return (
    <div className="Map">
        <div id="map" ref={el => (mapDiv.current = el)}
        style={{width: '100%', height: '100%'}}
        />
    </div>
  );
}
