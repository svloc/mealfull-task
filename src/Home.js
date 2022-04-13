import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { arrData } from "./data";
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
  let { date } = p;
  const [showMore, setShowMore] = useState(false);
  const [moreData, setMoreData] = useState([]);
  

  useEffect(() => {
    if (showMore) {
      get_more_info();
    }
  });
  const get_data = () => {
    const filter_date = arrData.filter((a) => {
      const split_date = a.item_date.split("-");
      const compareDate = new Date(
        split_date[0],
        split_date[1] - 1,
        split_date[2]
      ).getTime();
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      return compareDate === date.getTime();
    });

    const graphDate = {};
    filter_date.map((obj) => {
      const sDate = new Date(new Date(obj.schedule_time).toDateString());
      const sDateString =
        sDate.getDate() +
        "-" +
        (sDate.getMonth() < 10 ? "0" + sDate.getMonth() : sDate.getMonth());
      if (graphDate[sDateString]) {
        graphDate[sDateString]++;
      } else {
        graphDate[sDateString] = 1;
      }
    });
    return [Object.keys(graphDate), Object.values(graphDate)];
  };

  const datas = get_data();
  

  const get_more_info = () => {
    let dateArr=[];
    let hours = [
      {hoursName: '9am to 12pm', from: 9, to: 12},
      {hoursName: '12pm to 3pm', from: 12, to: 15},
      {hoursName: '3pm to 6pm', from: 15, to: 18},
      {hoursName: '6pm to 9pm', from: 18, to: 21}];
   
   const targetDate = new Date("2021-05-20");
   
   const filter_by_date= arrData.filter((e)=>{
      return e.schedule_time.split(" ")[0].substring(5,10)==moreData.split('-')[1]+'-'+moreData.split('-')[0];
    })

    // filter_by_date.filter((f)=>{
    //   dateArr.push(new Date('1970-01-01T' + f.schedule_time.split(' ')[1] + 'Z').toLocaleTimeString('en-US',
    //   {timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'}));});
    
    const previousItems = arrData.filter(({ schedule_time }) => {
      const scheduleTime = new Date(schedule_time);
      return scheduleTime < targetDate;
    });
    const result = previousItems.reduce((acc, { schedule_time }) => {
      const scheduleTime = new Date(schedule_time);
      const targetHour = scheduleTime.getHours();
      const { hoursName } = hours.find(({ from, to }) => (targetHour >= from) && (targetHour < to));
      acc[hoursName] = (acc[hoursName] ?? 0) + 1;
      return acc;
    }, {});
    console.log(result);
 };

  return (
    <div className="graph-component">
      {!showMore && (
        <Bar
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
          options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: "Scheduled Per Day",
              },
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
          <button onClick={() => setShowMore(false)}>Back</button>
        </div>
      )}
    </div>
  );
}
