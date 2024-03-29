import express from 'express';
import config from 'config';

const PORT = config.get('server').port;
const ACCESS_TOKEN = config.get('ACCESS_TOKEN');
const ACCOUNT_ID = config.get('ACCOUNT_ID');
const app = express();

app.get('/', (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Doodle Dash listening on port ${PORT}!`);

});

FB.api(
    '/me',
    'GET',
    {"fields":"id,name,last_name","access_token":`${ACCESS_TOKEN}`,"X-App-Usage":null},
    function(response) {
        console.log(response);
    }
  );

//trying child_process.exec from node to execute the curl

// import exec from 'node:child_process';
// const command = 'curl -i -X GET <https://graph.facebook.com/v19.0/me?fields=id%2Cname%2Clast_name&acces_token=>${ACCESS TOKEN}"';

// exec(command, { encoding: 'utf-8' }, (error, stdout, stderr) => {
//     if (error !== null) {
//         console.log('Error', error, stderr);
//         return;
//     }

//     const [responseMetadata, response] = stdout.split('\n\n');

//     console.log('Metadata', JSON.parse(responseMetadata));
//     console.log('Response', JSON.parse(response));
// });