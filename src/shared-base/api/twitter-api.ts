import request, { BaseplateResp } from 'src/baseplate/request';

const TwitterApi = {
  GetRequestToken: async () => {
    let response = await request(
      `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/auth/twitter_request`,
      {
        method: 'GET',
        headers: {
          'content-Type': 'application/json',
          Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`
        }
      }
    );
    // if (response) { // if HTTP-status is 200-299
    //     // get the response body (the method explained below)
    //     let json = await response.json();
    //     return json.data.request_token
    // }

    return response;
  }

  // GetRequestToken: async () => {
  //     let url = `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/auth/twitter_request`
  //     let response = request(url, {
  //         headers: {
  //             'content-Type': 'application/json',
  //             "Authorization": process.env.REACT_APP_PROFILE_API_SERVICE_KEY
  //         }
  //     });

  //     if (response.ok) { // if HTTP-status is 200-299
  //         // get the response body (the method explained below)
  //         let json = await response.json();
  //         return json.data.request_token
  //     }

  //     return ""

  // },
  // CallbackTwitter: async (oauth_token, oauth_verifier) => {

  //     let response = await fetch(`${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/auth/twitter_callback`, {
  //         method: 'POST',
  //         headers: {
  //             'Content-Type': 'application/json',
  //             "Authorization": process.env.REACT_APP_PROFILE_API_SERVICE_KEY
  //         },
  //         body: JSON.stringify({
  //             token: oauth_token,
  //             verifier: oauth_verifier
  //         })
  //     });

  //     if (response.ok) {
  //         return await response.json()
  //     }

  //     return null;
  // }
};

export default TwitterApi;
