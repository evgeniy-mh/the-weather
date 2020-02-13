import * as React from "react";

import './StatusBadge.css'

export enum BadgeStatus {
    normal = 'normal',
    warning = 'warning',
    danger = 'danger',
}

interface Props {
    text: string;
    status: BadgeStatus;
}

export const StatusBadge = ({ text, status }: Props) => {
    return <span className={`status-badge ${status}`}>{text}</span>
}