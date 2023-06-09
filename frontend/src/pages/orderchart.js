import React, { useEffect, useRef, useState } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, Label, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function AmountDateBarChart(orders) {
  return (
    <ResponsiveContainer width="100%" height={500}>
    <BarChart
          width={500}
          height={300}
          data={orders}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="orderDate">
            <Label value="Order Date" offset={-1} position="insideBottom" />
          </XAxis>
          <YAxis type="number" domain={[0, 'datamax']} label={{ value: 'Amount', angle: -90, position: 'insideLeft', textAnchor: 'middle' }}/>
          <Tooltip />
          <Legend />
          <Bar name='Quantity of Order' dataKey="quantity" fill="#8884d8" />
        </BarChart>
    </ResponsiveContainer>
  );
}

  export default function Orderchart() {
    const [orders, setOrders] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const COLORS = ['#edc951 ', '#eb6841 ', '#cc2a36 ', '#4f372d ', '#00a0b0'];
    const data = [];
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    // filter the data to show only data between 2022/02/01 and 2022/02/30
    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
    };

    function getToken() {
      const tokenString = sessionStorage.getItem('token');
      return JSON.parse(tokenString);

    }
    let formDatas = {
        orderID: "",
        itemID: "",
        quantity: "",
        orderDate: "",
        orderPrice: "",
        customerID: "",
        shipID: "",
      };
     {
        React.useEffect(() => {
            fetch("http://localhost:8000/order",{
              headers: new Headers({
                'Authorization': 'Bearer '+ getToken()
            })
            })
              .then((res) => res.json())
              .then((data) => {
                setOrders(data);
                orders.map((order) => {});
                setLoading(false);
              }).catch((error) => {
                console.log('error: ' + error);
                // this.setState({ requestFailed: true });
              });
          }, []);
          const inputChanged = (event) => {
            formDatas[event.target.name] = event.target.value;
          };
          const [startDate, setStartDate] = useState('2022-01-01');
          const [endDate, setEndDate] = useState('2022-03-31');

          useEffect(() => {
            const startDateInput = document.getElementById('start-date');
            const endDateInput = document.getElementById('end-date');

            startDateInput.value = startDate;
            endDateInput.value = endDate;

            startDateInput.addEventListener('change', () => {
              const newStartDate = startDateInput.value;
              if (newStartDate > endDate) {
                setEndDate(newStartDate);
              }
              setStartDate(newStartDate);
            });

            endDateInput.addEventListener('change', () => {
              const newEndDate = endDateInput.value;
              if (newEndDate < startDate) {
                setStartDate(newEndDate);
              }
              setEndDate(newEndDate);
            });
          }, [startDate, endDate]);

          const filteredData = orders.filter((entry) => {
            const date = new Date(entry.orderDate);
            return date >= new Date(startDate) && date <= new Date(endDate);
          });
    return (
    <div>
        <h1 className="title is-1">Order Visualization</h1>
        {/* button that redirects to the order page */}
      <a href="/order">
        <button className="button is-primary" >Back</button>
      </a>
      <div>
      <label for="start-date">Start date:</label>
      <input type="date" id="start-date"></input>

      <label for="end-date">End date:</label>
      <input type="date" id="end-date"></input>
      </div>
    <h3 className="title is-1">Bar Chart of Amount of Orders on a Given Date</h3>
    {AmountDateBarChart(filteredData)}
      </div>
    );
    }
  }

  export function Orderbarchart() {
    const [orders, setOrders] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const COLORS = ['#edc951 ', '#eb6841 ', '#cc2a36 ', '#4f372d ', '#00a0b0'];
    const data = [];
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    // filter the data to show only data between 2022/02/01 and 2022/02/30
    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
    };

    function getToken() {
      const tokenString = sessionStorage.getItem('token');
      return JSON.parse(tokenString);

    }
    let formDatas = {
        orderID: "",
        itemID: "",
        quantity: "",
        orderDate: "",
        orderPrice: "",
        customerID: "",
        shipID: "",
      };
      {
        React.useEffect(() => {
            fetch("http://localhost:8000/order",{
              headers: new Headers({
                'Authorization': 'Bearer '+ getToken()
            })
            })
            
              .then((res) => res.json())
              .then((data) => {
                setOrders(data);
                orders.map((order) => {});
                setLoading(false);
              }).catch((error) => {
                console.log('error: ' + error);
                // this.setState({ requestFailed: true });
              });
          }, []);
          const inputChanged = (event) => {
            formDatas[event.target.name] = event.target.value;
          };
          const [startDate, setStartDate] = useState('2022-01-01');
          const [endDate, setEndDate] = useState('2022-03-31');

          useEffect(() => {
            const startDateInput = document.getElementById('start-date');
            const endDateInput = document.getElementById('end-date');

          });

          const currentDate = new Date();
          const oneWeekAgo = new Date();
          const oneMonthAgo = new Date();
          const oneYearAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
          oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);


          const currentDateFormatted = currentDate.toISOString().substring(0, 10);
          const oneWeekAgoFormatted = oneWeekAgo.toISOString().substring(0, 10);
          const oneMonthAgoFormatted = oneMonthAgo.toISOString().substring(0, 10);
          const oneYearAgoFormatted = oneYearAgo.toISOString().substring(0, 10);

          const filteredData = orders.filter((entry) => {
            const date = new Date(entry.orderDate);
            console.log(date);
            return date.getMonth() == 3 && date.getFullYear() === 2021
            return date >= new Date(oneMonthAgoFormatted) && date <= new Date(currentDateFormatted);
          });
          
    return (
    <div>
    <h3 className="title is-1"><center>Amount of Orders from the Past Month</center></h3>
    {AmountDateBarChart(filteredData)}
      </div>
    );
    }
  }