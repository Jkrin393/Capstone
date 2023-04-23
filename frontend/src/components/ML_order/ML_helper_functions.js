import React,{ useState, useRef } from "react"



export const DollarFormat = ({ amount }) => {
    const formattedAmount = Number(amount).toLocaleString(undefined, {
      style: "currency",
      currency: "USD"
    });
  
    return <span>{formattedAmount}</span>;
  };


export const TopThreeTable =  ({ datas }) => {
    return (
      <table>
        <thead>
          <tr>
            <th>Customer ID
            <span className="separator">|</span>
            </th>
            <th>Total Orders
            <span className="separator">|</span>
            </th>
            <th>Total Spent
            <span className="separator">|</span>
            </th>
            <th>Average Order
            <span className="separator">|</span>
            </th>
          </tr>
        </thead>
        <tbody>
        {datas.map((data) => (
          <tr key={data.CustomerID}>
            <td>{data.CustomerID}</td>
            <td>{data.TotalOrders}</td>
            <td>
                <DollarFormat amount = {data.TotalAmountSpent}/>
            </td>
            <td>
                <DollarFormat amount = {data.AverageOrderPrice}/>
            </td>
          </tr>
          ))}
        </tbody>
      </table>
    );
  };

export const OrderbyCustomerTable = ({customers}) => {
    return(
        <table>
        <thead>
          <tr>
            <th>Customer ID
            <span className="separator">|</span>
            </th>
            <th>Total Orders
            <span className="separator">|</span>
            </th>
            </tr>
        </thead>
        <tbody>
        {customers.map((customer) => (
          <tr key={customer.customerID}>
            <td>{customer.customerID}</td>
            <td>{customer.order_count}</td>
          </tr>
          ))}
        </tbody>
        </table>

    );
};

export const TopItemsByMonth = ({items}) => {
  return (
    <table>
    <thead>
      <tr>
        <th>Month
          <span className="separator">|</span>
        </th>
        <th>Item 1 
        <span className="separator">|</span>
        </th>
        <th>Item 2 
        <span className="separator">|</span>
        </th>
        <th>Item 3 
        <span className="separator">|</span>
        </th>
        </tr>
    </thead>
    <tbody>
    {items.map((item) => (
      <tr key={item.month}>
        <td>{item.month}</td>
        <td>{item.item1}</td>
        <td>{item.item2}</td>
        <td>{item.item3}</td>
      </tr>
      ))}
    </tbody>
    </table>
  )
}