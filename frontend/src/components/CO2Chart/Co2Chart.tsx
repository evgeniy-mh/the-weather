import * as React from "react";
import { CartesianGrid, AreaChart, YAxis, XAxis, Tooltip, Area, ResponsiveContainer } from "recharts";
import { Co2ValueLogEntry } from "../../Models";

import './Co2Chart.css';
import { StatusBadge, BadgeStatus } from "../StatusBadge/StatusBadge";

interface Props {
    data: Co2ValueLogEntry[];
}

export interface ChartData {
    readonly co2: number;
    readonly time: string;
}

export const Co2Chart = ({ data }: Props) => {

    const lastPPMValue = data[data.length - 1]?.co2;

    return (
        <div className='co2-chart-container'>
            <h2 className='co2-chart-header'>
                CO2 Chart
                <StatusBadge
                    text={`${lastPPMValue} ppm`}
                    status={getCo2BadgeStatus(lastPPMValue)}
                />
            </h2>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                    width={500}
                    height={400}
                    data={convertToChartData(data)}
                    margin={{
                        top: 10, right: 30, left: 0, bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[500, 'dataMax + 210']} />
                    <Tooltip />
                    <Area type="monotone" dataKey="co2" stroke="#5aa547" fill="#5aa547" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}


function convertToChartData(data: Co2ValueLogEntry[]): ChartData[] {
    return data.map(e => {
        const { co2, time } = e;

        const hours: number = time.getHours();
        const twoDigitHours: string | number = hours < 10
            ? '0' + hours
            : hours;

        const minutes: number = time.getMinutes();
        const twoDigitMinutes: string | number = minutes < 10
            ? '0' + minutes
            : minutes;

        const seconds: number = time.getSeconds();
        const twoDigitSeconds: string | number = seconds < 10
            ? '0' + seconds
            : seconds;

        const entry: ChartData = {
            co2,
            time: `${twoDigitHours}:${twoDigitMinutes}:${twoDigitSeconds}`,
        }
        return entry;
    });
}

function getCo2BadgeStatus(level: number): BadgeStatus {
    if (level > 1500) {
        return BadgeStatus.danger;
    } else if (level > 1000) {
        return BadgeStatus.warning;
    } else {
        return BadgeStatus.normal;
    }
}