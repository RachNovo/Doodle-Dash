import config from 'config';
import axios from 'axios';
import logger from './logger.js';
import sanitize from './util/sanitize.js';

const ACCESS_TOKEN = config.get('ACCESS_TOKEN');
const url = 'https://graph.facebook.com/v19.0/me?fields=id%2Cname%2Clast_name&access_token=' + ACCESS_TOKEN;

const fetchData = async () => {
    let response;
    try {
        response = await axios.get(url);
        logger.info(`received data from FB API`, {data: response.data});
        const percentageOfCallsUsed = JSON.parse(response.headers['x-app-usage']).call_count;
        if (percentageOfCallsUsed > 80) {
            setTimeout(fetchData, 100000);
            logger.warn(`${percentageOfCallsUsed}% of calls used! Calls reduced to every: 100 seconds`);
        } else {
            setTimeout(fetchData, 2000);
            logger.info(`calls every 2 seconds, ${percentageOfCallsUsed}% of total calls used`);
        }
    } catch (error) {
        //cases: over limit, malformed token, expired token, token missing
        let message;
        const headers = error.response.headers;
        const authenticationError = headers['www-authenticate'];
        if(authenticationError) {
            if (headers['x-app-usage']) {
                const percentageOfCallsUsed = JSON.parse(headers['x-app-usage']).call_count;
                message = `${authenticationError}, using ${percentageOfCallsUsed}% of total calls`;
            } else {
                message = authenticationError;
            }
        } else {
            message = error;
        }

        logger.error(`${ sanitize(message) }`);
        setTimeout(fetchData, 5000);
    }
}
fetchData();
