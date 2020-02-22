import * as React from "react";
import Select from "@material-ui/core/Select/Select";

import "./LogIntervalSelector.css"
import FormControl from "@material-ui/core/FormControl/FormControl";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import Typography from "@material-ui/core/Typography/Typography";

interface Props {
    initialTimeValueMs: number,
    logEntriesCount: number,

    onChange: (value: number) => void;
}

export function LogIntervalSelector({
    initialTimeValueMs,
    logEntriesCount,
    onChange
}: Props) {
    return (
        <div className='log-interval-slider'>
            <FormControl fullWidth={true}>
                <Typography variant="h5">
                    Log interval
                </Typography>
                {getTimeEntrySelectVariants()}
            </FormControl>
            {getDescription(initialTimeValueMs, logEntriesCount)}
        </div>
    );

    function getTimeEntrySelectVariants() {
        const allEntriesMs = [...defaultTimeIntervalsMs];
        if (!allEntriesMs.includes(initialTimeValueMs)) {
            allEntriesMs.push(initialTimeValueMs);
        }

        const menuItems = allEntriesMs
            .sort((a, b) => a - b)
            .map((valueMs) => {
                const label = convertMsToHumanReadableString(valueMs);
                return (
                    <MenuItem value={valueMs} key={label}>
                        {label}
                    </MenuItem>
                );
            });

        return (
            <Select
                value={initialTimeValueMs}
                onChange={event => onChange(event.target.value as number)}
            >
                {menuItems}
            </Select>
        );
    }
}

function getDescription(logIntervalMs: number, logEntriesCount: number): React.ReactNode {
    const timeString: string = convertMsToHumanReadableString(logIntervalMs * logEntriesCount);

    const time = (
        <span className='log-time-length'>
            {timeString}
        </span>
    );

    return (
        <div className='log-interva-description'>
            Bimo will keep {time} of co2 log
        </div>
    );
}

function convertMsToHumanReadableString(ms: number): string {
    const secondsAll = Math.trunc(ms / 1000);
    const minutesAll = Math.trunc(secondsAll / 60);
    const hoursAll = Math.trunc(minutesAll / 60);
    const daysAll = Math.trunc(hoursAll / 24);
    
    const hoursLeft = Math.trunc(hoursAll % 24);
    const minutesLeft=Math.trunc(minutesAll % 60);
    const secondsLeft=Math.trunc(secondsAll % 60);

    return `${daysAll > 0 ? `${daysAll} days` : ''}
    ${hoursLeft!==0 ? `${hoursLeft} hours` : ''}
    ${minutesLeft!==0 ? `${minutesLeft} minutes` : ''}
    ${(secondsLeft > 0 && secondsLeft < 60) ? `${secondsLeft} seconds` : ''}`;
}

const defaultTimeIntervalsMs: number[] = [
    5_000,    // 5 sec
    30_000,   // 30 sec
    60_000,   // 1 min
    300_000,  // 5 min
    600_000,  // 10 min
    900_000,  // 15 min
    1800_000  // 30 min
];