import config from 'config';
import axios from 'axios';
import logger from './logger.js';

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
        let message;
        if(error.response.headers['www-authenticate']) {
            message = error.response.headers['www-authenticate'];
        } else {
            message = error;
        }
        logger.error(`Error fetching data: ${ message }`);
        setTimeout(fetchData, 5000);
    }
}
fetchData();
