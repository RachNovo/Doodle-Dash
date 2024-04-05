interface MockAPICall {
  data: {
      id: string,
      name: string,
      last_name: string
  },
  headers: { 'x-app-usage': string }
}

interface MockAPIErrors {
  [key: string]: string
}

export const mockAPICall: MockAPICall = {
    data: {
      id: '123456',
      name: 'Name',
      last_name: 'Last_Name'
    },
    headers: { 'x-app-usage': '{"call_count":0}' }
};

export const mockAPIErrors: MockAPIErrors = {
    'expired access token': 'OAuth "Facebook Platform" "invalid_token" "Error validating access token: Session has expired on Saturday, 30-Mar-24 16:00:00 PDT. The current time is Sunday, 31-Mar-24 14:58:07 PDT."',
    'invalid access token': 'OAuth "Facebook Platform" "invalid_token" "Malformed access token ACCESS_TOKEN"',
    'missing access token': 'OAuth "Facebook Platform" "invalid_request" "An active access token must be used to query information about the current user."',
    'rate limit exceeded': 'OAuth "Facebook Platform" "invalid_request" "(#4) Application request limit reached"'
};
