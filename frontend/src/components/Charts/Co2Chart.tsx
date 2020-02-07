import * as React from "react";
import { Co2ChartData } from "../../Models";
import { CartesianGrid, AreaChart, YAxis, XAxis, Tooltip, Area } from "recharts";

interface Props {
    data: Co2ChartData;
}

export const Co2Chart = ({ data }: Props) => {
    return (
        <AreaChart
            width={500}
            height={400}
            data={data.values}
            margin={{
                top: 10, right: 30, left: 0, bottom: 0,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[500, 'dataMax + 210']} />
            <Tooltip />
            <Area type="monotone" dataKey="co2" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
    )
}