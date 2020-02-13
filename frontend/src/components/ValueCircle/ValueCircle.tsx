import * as React from "react";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import './ValueCircle.css'

interface Props {
    header: string;
    value: number;
    valueUnit: '%' | 'C°'
}

export const ValueCircle = ({ header, value, valueUnit }: Props) => {
    return (
        <div className='value-circle-container'>
            <h2 className='value-circle-header'>{header}</h2>
            {/* <CircularProgress variant="static" value={55} /> */}
            <CircularProgressbar value={value} text={value + valueUnit} />
        </div>
    );
}