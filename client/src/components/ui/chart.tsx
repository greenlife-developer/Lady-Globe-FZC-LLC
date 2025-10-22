
import { Line, Bar, Pie } from "recharts";
import { ResponsiveContainer, LineChart as RechartsLineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart as RechartsBarChart, PieChart as RechartsPieChart, Cell } from "recharts";

interface ChartProps {
  data: any;
  className?: string;
}

export function LineChart({ data, className }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartsLineChart
        data={data.labels.map((label: string, i: number) => ({
          name: label,
          ...(data.datasets.reduce((acc: any, dataset: any) => {
            acc[dataset.label] = dataset.data[i];
            return acc;
          }, {}))
        }))}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />
        <XAxis dataKey="name" stroke="rgba(0, 0, 0, 0.6)" />
        <YAxis stroke="rgba(0, 0, 0, 0.6)" />
        <Tooltip 
          contentStyle={{ backgroundColor: "white", borderRadius: "6px", borderColor: "rgba(0,0,0,0.1)" }}
          itemStyle={{ fontSize: "12px" }}
        />
        <Legend />
        {data.datasets.map((dataset: any, index: number) => (
          <Line
            key={index}
            type="monotone"
            dataKey={dataset.label}
            stroke={dataset.borderColor}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            fill={dataset.backgroundColor}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

export function BarChart({ data, className }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartsBarChart
        data={data.labels.map((label: string, i: number) => ({
          name: label,
          ...(data.datasets.reduce((acc: any, dataset: any) => {
            acc[dataset.label] = dataset.data[i];
            return acc;
          }, {}))
        }))}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />
        <XAxis dataKey="name" stroke="rgba(0, 0, 0, 0.6)" />
        <YAxis stroke="rgba(0, 0, 0, 0.6)" />
        <Tooltip 
          contentStyle={{ backgroundColor: "white", borderRadius: "6px", borderColor: "rgba(0,0,0,0.1)" }}
          itemStyle={{ fontSize: "12px" }}
        />
        <Legend />
        {data.datasets.map((dataset: any, index: number) => (
          <Bar
            key={index}
            dataKey={dataset.label}
            fill={dataset.backgroundColor}
            barSize={30}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

export function PieChart({ data, className }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartsPieChart>
        <Tooltip 
          contentStyle={{ backgroundColor: "white", borderRadius: "6px", borderColor: "rgba(0,0,0,0.1)" }}
          itemStyle={{ fontSize: "12px" }}
        />
        <Pie
          data={data.labels.map((label: string, i: number) => ({
            name: label,
            value: data.datasets[0].data[i],
          }))}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
          label={(entry) => entry.name}
          labelLine={{ stroke: "rgba(0,0,0,0.3)", strokeWidth: 1 }}
        >
          {data.labels.map((_, index: number) => (
            <Cell key={`cell-${index}`} fill={data.datasets[0].backgroundColor[index]} />
          ))}
        </Pie>
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}
