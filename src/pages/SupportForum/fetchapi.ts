import request, { BaseplateResp } from 'src/baseplate/request';

export function fetchGithubIssues(): Promise<BaseplateResp> {
  const owner = 'tuum-tech';
  const repos = 'profile';
  return request(
    `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/support_router/github/${owner}/${repos}/issues`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`
      }
    }
  );
}
