import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TableData } from "../types";

type LineGraphProps = {
  data: TableData[];
};

export default function LineGraph(props: LineGraphProps) {
  return (
    <ResponsiveContainer width={500} height={300} className="rounded">
      <LineChart
        data={props.data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="totalJobs"
          name="Total Jobs"
          stroke="#d88484"
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="avgSalary"
          name="Average Salary (USD)"
          stroke="#7e18c2"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
