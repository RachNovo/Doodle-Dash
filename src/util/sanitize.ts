import config from 'config';

interface Sanitize {
    (info: object | string): object | string;
}

export const sanitize: Sanitize = (info) => {
    const infoString = JSON.stringify(info);
    const token = config.get('ACCESS_TOKEN');
    if(token && infoString.includes(token)) {
        return JSON.parse(infoString.replace(token, 'ACCESS_TOKEN'));
    }
    return info;
};
