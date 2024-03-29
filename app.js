// import express from 'express';
import config from 'config';
import axios from 'axios';

// const PORT = config.get('server').port;
// const app = express();
// app.listen(PORT, () => {
//   console.log(`Doodle Dash listening on port ${PORT}!`);
// });

const ACCESS_TOKEN = config.get('ACCESS_TOKEN');
const url = 'https://graph.facebook.com/v19.0/me?fields=id%2Cname%2Clast_name&access_token=' + ACCESS_TOKEN;

const fetchData = async () => {
    try {
        const response = await axios.get(url);
        console.log(response.data); //do something
        const percentageOfCallsUsed = JSON.parse(response.headers['x-app-usage']).call_count;
        if (percentageOfCallsUsed > 80) {
            setTimeout(fetchData, 90000);
            console.log(percentageOfCallsUsed, '% of calls used!', 'calls reduced to every: 90 seconds');
        } else {
            setTimeout(fetchData, 2000);
            console.log('calls every 2 seconds, ', 'used: ', percentageOfCallsUsed);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        setTimeout(fetchData, 5000);
    }
}
fetchData();
