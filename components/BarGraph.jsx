
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const data = [
  { name: "Aug 14", uv: 4500 },
  { name: "Aug 15", uv: 4000 },
  { name: "Aug 16", uv: 5900 },
  { name: "Aug 17", uv: 3000 },
  { name: "Aug 18", uv: 1500 },
];

const CustomTooltip = ({ active, payload, label }) => 
  active && payload?.length ? (
    <div className="bg-white p-2 rounded-lg shadow-md">
      {`${label} : ${payload[0].value}`}
    </div>
  ) : null;

const BarGraph = () => (
  <div className="flex-1 p-4 rounded-lg bg-[#F4F1F0] w-full">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">New Users</h3>
    <div className="flex items-center mb-4">
      <span className="bg-red-100 px-2 py-1 rounded-full text-red-500">-0.1%</span>
      <p className="text-gray-600 ml-2">From Last Period</p>
    </div>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: "#9c8b84" }} tickLine={false} />
        <YAxis hide domain={[0, 7000]} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="uv" fill="#c8b3a8" radius={[50, 50, 0, 0]} barSize={50}>
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.name === "Aug 16" ? "#4a403a" : "#c8b3a8"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default BarGraph;