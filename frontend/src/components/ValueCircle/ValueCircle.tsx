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
        <div className='circle-container'>
            <h4 className='circle-header'>{header}</h4>
            <CircularProgressbar value={value} text={value + valueUnit} />
        </div>
    );
}