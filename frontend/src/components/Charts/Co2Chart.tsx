import * as React from "react";
import { CartesianGrid, AreaChart, YAxis, XAxis, Tooltip, Area } from "recharts";
import { Co2ValueLogEntry } from "../../Models";

interface Props {
    data: Co2ValueLogEntry[];
}

export interface ChartData {
    readonly co2: number;
    readonly time: string;
}

export const Co2Chart = ({ data }: Props) => {
    return (
        <AreaChart
            width={500}
            height={400}
            data={convertToChartData(data)}
            margin={{
                top: 10, right: 30, left: 0, bottom: 0,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time"/>
            <YAxis domain={[500, 'dataMax + 210']} />
            <Tooltip />
            <Area type="monotone" dataKey="co2" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
    )
}


function convertToChartData(data: Co2ValueLogEntry[]): ChartData[]{
    return data.map(e=>{
        const entry: ChartData={
            co2: e.co2,
            time: `${e.time.getHours()}:${e.time.getMinutes()}:${e.time.getSeconds()}`
        }
        return entry;
    });
}