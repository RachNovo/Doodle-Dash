import config from 'config';
import axios from 'axios';
import { logger } from './logger/index.js';
import { sanitize } from './util/sanitize.js';

const ACCESS_TOKEN = config.get('ACCESS_TOKEN');
const params = new URLSearchParams({
    fields: 'id,name,last_name',
    access_token: ACCESS_TOKEN
});
const url = `https://graph.facebook.com/v19.0/me?${params.toString()}`;

const HIGH_PERCENTAGE_WARNING = 99;
const INITIAL_FREQUENCY = 2000;
const HIGH_PERCENTAGE_FREQUENCY = 100000;
let errorRetryFrequency = INITIAL_FREQUENCY;

export const fetchData = async () => {
    let response;
    try {
        response = await axios.get(url);
        logger.info('received data from FB API', {data: response.data});
        const percentageOfCallsUsed = JSON.parse(response.headers['x-app-usage']).call_count;
        if (percentageOfCallsUsed > HIGH_PERCENTAGE_WARNING) {
            setTimeout(fetchData, HIGH_PERCENTAGE_FREQUENCY);
            logger.warn(`${percentageOfCallsUsed}% of calls used! Calls reduced to every: 100 seconds`);
        } else {
            setTimeout(fetchData, INITIAL_FREQUENCY);
            logger.info(`calls every 2 seconds, ${percentageOfCallsUsed}% of total calls used`);
        }
        errorRetryFrequency = INITIAL_FREQUENCY;
    } catch (error) {
        let message;
        const headers = error.response.headers;
        const authenticationError = headers['www-authenticate'];
        if(authenticationError) {
            if (headers['x-app-usage']) {
                const percentageOfCallsUsed = JSON.parse(headers['x-app-usage']).call_count;
                message = `${authenticationError}, ${percentageOfCallsUsed}% of total calls used`;
                if (percentageOfCallsUsed > 100) {
                    errorRetryFrequency = errorRetryFrequency * 2;
                }
            } else {
                message = authenticationError;
            }
        } else {
            message = error;
        }

        logger.error(sanitize(message));
        console.log('retrying in ', errorRetryFrequency/1000, ' seconds');
        setTimeout(fetchData, errorRetryFrequency);
    };
};
