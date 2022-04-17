import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { arrData } from "./data";
import {Chart as ChartJS,CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend,} from "chart.js";
ChartJS.register( CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend);

export default function Home(p) {
  let { date } = p;
  const [showMore, setShowMore] = useState(false);
  const [moreData, setMoreData] = useState([]);
  let schedule_1={};
  
  const get_data = () => {
    const graphDate = {};
    const filter_date = arrData.filter((a) => {
    const split_date = a.item_date.split("-");
    const compareDate = new Date(split_date[0],split_date[1] - 1,split_date[2]).getTime();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    return compareDate === date.getTime();
   });
   
   filter_date.map((obj) => {
    const sDate = new Date(new Date(obj.schedule_time).toDateString());
    const sDateString =sDate.getDate() +"-" +(sDate.getMonth() < 10 ? "0" + sDate.getMonth() : sDate.getMonth());
    if (graphDate[sDateString]) {
      graphDate[sDateString]++;
    } 
    else {
      graphDate[sDateString] = 1;
    }
   });
   return [Object.keys(graphDate), Object.values(graphDate)];
  };
  const datas = get_data();
  
  if (showMore) {
   const getScheduleCounter = (d) => {
   let scheduleCounter = {'9am_12am':'','12am_3pm':'', '3pm_6pm': '', '6pm_9pm': ''};
   const filter_by_date= arrData.filter((e)=>{
      return e.schedule_time.split(" ")[0].substring(5,10)==moreData.split('-')[1]+'-'+moreData.split('-')[0];
   })
   filter_by_date.forEach(sch => {
    if (new Date(sch.item_date) !== d) {
      updateScheduledCounter(sch, scheduleCounter);
    }
   });
   return scheduleCounter;
   }
   let updateScheduledCounter = (sch, scheduleCounter) => {
    let time = sch.schedule_time.split(' ')[1];
    switch (!!time) {
      case (time <= '12:00:00'):
        scheduleCounter['9am_12am']++;
        break;
      case (time >= '12:00:00' && time <= '15:00:00'):
        scheduleCounter['12am_3pm']++;
        break;
      case (time >= '15:00:00' && time <= '18:00:00'):
        scheduleCounter['3pm_6pm']++;
        break;
      case (time >= '18:00:00' && time <= '21:00:00'):
        scheduleCounter['6pm_9pm']++;
        break;
    } 
   }
   schedule_1=getScheduleCounter(new Date(date));
  }
  
  return (
    <div className="graph-component">
      {!showMore && (
        <Bar data={{
            labels: datas[0],
            datasets: [{label: "Schedule Count", data: datas[1],backgroundColor: "#342df2a6",},],
           }}
          options={{
            responsive: true,
            plugins: {
              title: {display: true,text: "Scheduled Per Day", },
            },
            onClick: function (evt, element) {
              if (element.length > 0) {
                setMoreData(datas[0][element[0].index]);
                setShowMore(true);
              }
            },
          }}
        />
      )}
      {showMore && (
        <div>
          <div>
            <table>
              <tr>
                <th>9AM to 12AM </th>
                <th>12AM to 3PM </th>
                <th>3PM to 6PM </th>
                <th>6PM to 9PM </th>
              </tr>
              <tr>
                <td>{Object.values(schedule_1)[0]==[] ? <span> No Schedule</span>:Object.values(schedule_1)[0]}</td>
                <td>{Object.values(schedule_1)[1]==[] ? <span> No Schedule</span>:Object.values(schedule_1)[1]}</td>
                <td>{Object.values(schedule_1)[2]==[] ? <span> No Schedule</span>:Object.values(schedule_1)[2]}</td>
                <td>{Object.values(schedule_1)[3]==[] ? <span> No Schedule</span>:Object.values(schedule_1)[3]}</td>
              </tr>
            </table>
           </div>
           <div className="btn-div">
            <button className="btn" onClick={() => setShowMore(false)}>Back</button>
           </div>
        </div>
      )}
    </div>
  );
}
