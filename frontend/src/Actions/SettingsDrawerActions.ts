export type SETTINGS_DRAWER_ACTION = 'OPEN_SETTINGS' | 'CLOSE_SETTINGS';

export interface SettingsDrawerAction {
    type: SETTINGS_DRAWER_ACTION
}

export function openSettingsDrawer(): SettingsDrawerAction {
    return {
        type: 'OPEN_SETTINGS'
    }
}

export function closeSettingsDrawer(): SettingsDrawerAction {
    return {
        type: 'CLOSE_SETTINGS'
    }
}