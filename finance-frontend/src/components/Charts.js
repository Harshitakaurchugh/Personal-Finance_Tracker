import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const Charts = ({ data }) => {
  const chartData = Object.keys(data).map(key => ({
    category: key,
    amount: data[key]
  }));

  return (
    <BarChart width={400} height={300} data={chartData}>
      <XAxis dataKey="category" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="amount" />
    </BarChart>
  );
};

export default Charts;