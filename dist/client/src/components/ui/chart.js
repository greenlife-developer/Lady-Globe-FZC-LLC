"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineChart = LineChart;
exports.BarChart = BarChart;
exports.PieChart = PieChart;
var recharts_1 = require("recharts");
var recharts_2 = require("recharts");
function LineChart(_a) {
    var data = _a.data, className = _a.className;
    return (<recharts_2.ResponsiveContainer width="100%" height="100%" className={className}>
      <recharts_2.LineChart data={data.labels.map(function (label, i) { return (__assign({ name: label }, (data.datasets.reduce(function (acc, dataset) {
            acc[dataset.label] = dataset.data[i];
            return acc;
        }, {})))); })} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <recharts_2.CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)"/>
        <recharts_2.XAxis dataKey="name" stroke="rgba(0, 0, 0, 0.6)"/>
        <recharts_2.YAxis stroke="rgba(0, 0, 0, 0.6)"/>
        <recharts_2.Tooltip contentStyle={{ backgroundColor: "white", borderRadius: "6px", borderColor: "rgba(0,0,0,0.1)" }} itemStyle={{ fontSize: "12px" }}/>
        <recharts_2.Legend />
        {data.datasets.map(function (dataset, index) { return (<recharts_1.Line key={index} type="monotone" dataKey={dataset.label} stroke={dataset.borderColor} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} fill={dataset.backgroundColor}/>); })}
      </recharts_2.LineChart>
    </recharts_2.ResponsiveContainer>);
}
function BarChart(_a) {
    var data = _a.data, className = _a.className;
    return (<recharts_2.ResponsiveContainer width="100%" height="100%" className={className}>
      <recharts_2.BarChart data={data.labels.map(function (label, i) { return (__assign({ name: label }, (data.datasets.reduce(function (acc, dataset) {
            acc[dataset.label] = dataset.data[i];
            return acc;
        }, {})))); })} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <recharts_2.CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)"/>
        <recharts_2.XAxis dataKey="name" stroke="rgba(0, 0, 0, 0.6)"/>
        <recharts_2.YAxis stroke="rgba(0, 0, 0, 0.6)"/>
        <recharts_2.Tooltip contentStyle={{ backgroundColor: "white", borderRadius: "6px", borderColor: "rgba(0,0,0,0.1)" }} itemStyle={{ fontSize: "12px" }}/>
        <recharts_2.Legend />
        {data.datasets.map(function (dataset, index) { return (<recharts_1.Bar key={index} dataKey={dataset.label} fill={dataset.backgroundColor} barSize={30} radius={[4, 4, 0, 0]}/>); })}
      </recharts_2.BarChart>
    </recharts_2.ResponsiveContainer>);
}
function PieChart(_a) {
    var data = _a.data, className = _a.className;
    return (<recharts_2.ResponsiveContainer width="100%" height="100%" className={className}>
      <recharts_2.PieChart>
        <recharts_2.Tooltip contentStyle={{ backgroundColor: "white", borderRadius: "6px", borderColor: "rgba(0,0,0,0.1)" }} itemStyle={{ fontSize: "12px" }}/>
        <recharts_1.Pie data={data.labels.map(function (label, i) { return ({
            name: label,
            value: data.datasets[0].data[i],
        }); })} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" label={function (entry) { return entry.name; }} labelLine={{ stroke: "rgba(0,0,0,0.3)", strokeWidth: 1 }}>
          {data.labels.map(function (_, index) { return (<recharts_2.Cell key={"cell-".concat(index)} fill={data.datasets[0].backgroundColor[index]}/>); })}
        </recharts_1.Pie>
        <recharts_2.Legend />
      </recharts_2.PieChart>
    </recharts_2.ResponsiveContainer>);
}
