# Doodle-Dash

1. [Overview](#overview)
2. [Requirements](#requirements)
3. [Getting Started](#getting-started)
4. [Future Improvements](#future-improvements)
5. [Engineering Decisions](#engineering-decisions)

## Overview

Hello! This is an interview take home assignment completed by [RachNovo](https://github.com/RachNovo). I have built a production quality Node.js application that integrates with Meta's API to get basic user information.

## Requirements
- [x] Request data every 2 seconds
- [x] Run in any regular terminal
- [x] Accept configuration for an access token
- [x] Log data it is receiving
- [x] Handle rate limits using response headers

## Getting Started
> Follow these steps to install and run this application on your local machine.

*Prerequisites:* Git, Node.js, npm, basic [Facebook app](https://developers.facebook.com/docs/development) for a sandbox API token

### Installing and Set-up

1. Navigate to the local directory where you want to host the application.

2. Access the application by cloning the Github repository:

```bash
$ git clone https://github.com/RachNovo/Doodle-Dash.git
```
3. Navigate inside the directory: 'Doodle-Dash' and run:
```bash
$ npm install
```
4. Get your Access Token and App ID from the [Graph API Explorer Tool](https://developers.facebook.com/tools/explorer)
> Tip: You can extend the access token for up to three months by using the debug tool found [here](https://developers.facebook.com/tools/debug/accesstoken/).

6. Create a *local.json* file within the config folder and add the following. Replace the defaults with the appropriate values.
```json
{
"NODE_ENV": "local",
"ACCESS_TOKEN": "ACCESS_TOKEN",
"ACCOUNT_ID": "ACCOUNT_ID"
}
```
7. Start the application by running:
```bash
$ npm start
```

### Running the Tests
Run the test suite using the following command:
```bash
$ npm test
```

## Future Improvements
-  Use a scheduler or job queue for running periodic API requests.
- Implement Web Hooks to receive updates instead of relying solely on polling.
-  Optimize request frequency to avoid hitting rate limits while ensuring timely updates.

## Engineering Decisions
>Details of my thoughts and approach for this project:
- I have used setTimeout for running periodic API requests. For a larger application querying more data, it would be better to use a scheduler or job queue to avoid potential memory leaks and unexpected behaviour.
- Due to the rate limiting implemented by Meta's API and my current app set-up, I am only able to send an average of 200 requests per rolling hour. Although my application starts by requesting data every 2 seconds, the limit is quickly used up and this leads to a much slower request frequency to avoid hitting the rate limit. A better approach would be to set up a Web Hook in addition to direct polling so that the application is updated as changes are made. I chose not to implement a Web Hook for this use case as I have not hosted this application and did not want to expose my personal server (my computer) to the internet.
- I have set up constants at the beginning of my app file to avoid hard-coded numbers throughout the file and allow for easy updating.
- My application logs to the console when not running in production and to a file. The console logs are formatted with an emphasis on readability for the developer while the file logs are in json format to maximize querability for possible future extension to a database, etc.
- For testing, I decided to use sinon stubs. I do not need to test `axios.get`, `setTimeout` or `winston` but am testing if my function calls those methods as expected.
- For calling the API, I explored a few options including using the curl request provided and `child_process` but decided to use `axios` due to worries about compatability issues across different operating systems. I also wanted to use pure javascript for readability and have access to built-in error handling.
- I chose to use `URLSearchParams` for building my url for better readability of the query fields.
- I realized that some errors include the access token and I did not want to have sensitive data present in the logs. I created a sanitize function that removes the access token before it goes to the logger. I tried to add a custom format function for my `winston` logger to keep logger related activities out of my main function but wasn't able to get it working due to how to logger itself is implemented.
- I wanted to use a start script that asks the user for the access token and account id upon application start-up using `readlineSync` but found that `node-config` does not allow runtime changes to its configs due to security issues. For simplicity, I added checks for the values and user friendly messages as well as instructions here in the `README.md`. This type of script would not be present in an application running in production anyways.