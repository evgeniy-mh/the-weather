import * as React from "react";
import Typography from "@material-ui/core/Typography/Typography";
import Slider, { Mark } from "@material-ui/core/Slider/Slider";

import './LogDurationSelector.css';

interface Props {
    timeDurationHourValue: number;
    onChange: (value: number) => void;
}

const minHourValue = 1;
const maxHourValue = 24;

export function LogDurationSelector({ timeDurationHourValue, onChange }: Props) {
    return (
        <div className='log-duration-selector'>
            <Typography variant="h5">
                Log duration
            </Typography>
            <Typography variant="h6">
                {`Bimo will keep record of ${timeDurationHourValue} ${timeDurationHourValue === 1 ? 'hour' : 'hours'}`}
            </Typography>
            <Slider
                value={timeDurationHourValue}
                onChange={(e, value: number) => { onChange(value) }}
                valueLabelDisplay="auto"
                step={1}
                min={minHourValue}
                max={maxHourValue}
            />
        </div>
    );
}