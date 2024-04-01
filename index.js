import { fetchData } from './app.js';
import config from 'config';

const verifyConfigValues = () => {
    console.log('Checking for ACCESS_TOKEN and ACCOUNT_ID...');
    const isAccessTokenSet = config.get('ACCESS_TOKEN') !== 'ACCESS_TOKEN';
    const isAccountIdSet = config.get('ACCOUNT_ID') !== 'ACCOUNT_ID';
    if (isAccessTokenSet && isAccountIdSet) {
        console.log('Looks like you have configured an ACCESS_TOKEN and ACCOUNT_ID :)');
        return true;
    } else {
        console.log('Please retreive your ACCESS_TOKEN and ACCOUNT_ID from FaceBook\'s Graph API Tool and add them to a config file');
        return false;
    }

}

if (verifyConfigValues()) fetchData();
