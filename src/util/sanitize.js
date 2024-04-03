import config from 'config';

export const sanitize = (info) => {
    const infoString = JSON.stringify(info);
    const token = config.get('ACCESS_TOKEN');
    if(token && infoString.includes(token)) {
        return JSON.parse(infoString.replace(token, 'ACCESS_TOKEN'));
    }
    return info;
};
