"use client";
import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const data = [
  { name: "Dogs", value: 0 },
  { name: "Fish", value: 0 },
  { name: "Cats", value: 0 },
  { name: "Others", value: 0 }
];

const COLORS = ["#e57373", "#a1887f", "#fff176", "#d7ccc8"];

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return <text x={x} y={y} fill="black" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">{`${(percent * 100).toFixed(0)}%`}</text>;
};

const PetOwnersPieChart = () => (
  <div className="flex-1 p-4 rounded-lg bg-[#F4F1F0] w-full">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Pet Owners</h3>
    <div className="flex gap-4 items-center">
      <PieChart width={250} height={300}>
        <Pie data={data} cx="50%" cy="50%" labelLine={false} label={CustomLabel} outerRadius={100} dataKey="value">
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
      <ul className="space-y-2">
        {data.map((entry, index) => (
          <li key={index} className="flex items-center text-gray-600">
            <span className="w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: COLORS[index] }} />
            {`${entry.name}: 0`}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default PetOwnersPieChart;