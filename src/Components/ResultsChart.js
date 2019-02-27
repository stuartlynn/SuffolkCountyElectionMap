import React from 'react';

import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  HorizontalBarSeries,
  VerticalBarSeries,
} from 'react-vis';

export default function ResultChart(props) {
  const data = props.data.filter(d => !['Void','district_no','region'].includes(d[0]))
  const bars = data.map(entry => ({y: entry[0], x: entry[1]*100})).sort((a,b)=>{
    if(a.x> b.x) return 1
    if(a.x<b.x) return -1
    return 0
  })

  console.log(bars)
  return (
    <div className='barChart'>
        <h3>{bars[bars.length-1].y} Won with {bars[bars.length-1].x.toFixed(0)}% of the vote</h3>
        <XYPlot yType='ordinal' width={300} height={200} margin={{left: 150}}>
          <XAxis />
          <YAxis />
          <HorizontalBarSeries
            data={bars}
          />
        </XYPlot>
    </div>
  );
}
