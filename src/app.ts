import config from 'config';
import axios, { AxiosError } from 'axios';
import logger from './logger/index.js';
import sanitize from './util/sanitize.js';

const ACCESS_TOKEN: string = config.get('ACCESS_TOKEN');
const params = new URLSearchParams({
    fields: 'id,name,last_name',
    access_token: ACCESS_TOKEN
});
const url = `https://graph.facebook.com/v19.0/me?${params.toString()}`;

const HIGH_PERCENTAGE_WARNING = 80;
const INITIAL_FREQUENCY = 2000;
const HIGH_PERCENTAGE_FREQUENCY = 100000;
const ERROR_RETRY_FREQUENCY = 5000;

const fetchData: () => Promise<void> = async () => {
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
    } catch (error: unknown) {
        let message;
        const axiosError = error as AxiosError;
        if (axiosError && axiosError.response) {
            const headers = axiosError.response.headers;
            const authenticationError = headers['www-authenticate'];
            if(authenticationError) {
                if (headers['x-app-usage']) {
                    const percentageOfCallsUsed = JSON.parse(headers['x-app-usage']).call_count;
                    message = `${authenticationError}, ${percentageOfCallsUsed}% of total calls used`;
                } else {
                    message = authenticationError;
                }
            }
        } else {
            message = error;
        }

        logger.error(sanitize(message));
        setTimeout(fetchData, ERROR_RETRY_FREQUENCY);
    };
};

export default fetchData;
