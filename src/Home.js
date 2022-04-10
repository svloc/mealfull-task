import React,{useState,useEffect} from "react";
import { Bar } from "react-chartjs-2";
import {arrData} from './data' 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Home(p) {
  let {date}=p;
 const get_data=()=>{
   const filter_date=arrData.filter((a)=>{
     const split_date=a.item_date.split("-");
     const compareDate = new Date(split_date[0], split_date[1] - 1, split_date[2]).getTime();
     date.setHours(0);
     date.setMinutes(0);
     date.setSeconds(0);
     return compareDate === date.getTime();
   });
  
  const graphDate = {};
  filter_date.map((obj) => {
    const sDate = new Date(new Date(obj.schedule_time).toDateString());
    const sDateString =sDate.getDate() + "-" +(sDate.getMonth() < 10 ? "0" + sDate.getMonth() : sDate.getMonth());
    if (graphDate[sDateString]) {
      graphDate[sDateString]++;
    } else {
      graphDate[sDateString] = 1;
    }
  });
  return [Object.keys(graphDate), Object.values(graphDate)];
}

const datas = get_data();

const get_more_info=(a)=>{
console.log(a)
}
return (
  <div className="graph-component">
    <Bar

      options={{
       responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Scheduled Per Day",
          },
        },

        
      }}
      data={{
        labels: datas[0],
        datasets: [
          {
            label: "Schedule Count",
            data: datas[1],
            backgroundColor: "#342df2a6",
          },
        ],
      }}
    />
  </div>
);
}
