import React, {Component, useContext, useEffect, useRef} from 'react';
import ResultsChart from './ResultsChart'

import {Store} from '../Store';

export default function Stats(props) {
  const {state, dispatch} = useContext(Store);
  const {selectedRegion, selectedCandidate, electionResults} = state;
    
  const getSelectedStats = () =>
    electionResults.features.find(
      er =>
        er.properties.region == selectedRegion.region &&
        er.properties.district_no == selectedRegion.district_no,
    ).properties;


  const renderResults = (stats)=>(
    <ul>
        {Object.entries(stats).map((entry)=>(
            !['Void','district_no','region'].includes(entry[0]) &&
                <li>{entry[0]} : {(100*entry[1]).toFixed(2)} %</li>
        ))}
    </ul>
    )

  return (
    <div className="Stats">
      <div className="Candidate">
        <h1>{selectedCandidate} </h1>
      </div>

      <div className="Region">
        {selectedRegion && (
          <React.Fragment>
            <h1>
              {selectedRegion.region} : {selectedRegion.district_no}
            </h1>
            <ResultsChart data={Object.entries(getSelectedStats())} />
            </React.Fragment>
        )}
      </div>
    </div>
  );
}
