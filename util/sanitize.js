import config from 'config';

const sanitize = (info) => {
    const infoString = JSON.stringify(info);
    const token = config.get('ACCESS_TOKEN');
    if(token && infoString.includes(token)) {
        console.log(JSON.parse(infoString.replace(token, 'ACCESS_TOKEN')));
        return JSON.parse(infoString.replace(token, 'ACCESS_TOKEN'));
    }
    return info;
}

export default sanitize;