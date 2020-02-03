import * as React from "react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { SensorsInfoEntry } from "../../Models";

interface Props {
    data: SensorsInfoEntry[]
}

export const SensorsLineChart = ({ data }: Props) => {
    return (
        <>
            <ResponsiveContainer width='80%' height={300}>
                <LineChart
                    data={data}
                    margin={{
                        top: 5, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[300, 'dataMax + 210']} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="co2" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </>
    );

}