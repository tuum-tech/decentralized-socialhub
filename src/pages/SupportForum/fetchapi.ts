export const fetchGithubIssues = async () => {
  const owner = 'tuum-tech';
  const repos = 'profile';

  const apiRes = await fetch(
    `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/support_router/github/${owner}/${repos}/issues`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`
      }
    }
  );

  console.log('===>apiRes', apiRes);
};
