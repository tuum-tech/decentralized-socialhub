import request, { BaseplateResp } from 'src/baseplate/request';

export async function getNFTCollectionAssets(
  guid: any,
  offset: number,
  limit: number
): Promise<BaseplateResp> {
  return request(
    `${
      process.env.REACT_APP_PROFILE_API_SERVICE_URL
    }/v1/nft_collection_router/assets?collection_id=${JSON.stringify(
      guid
    )}&offset=${offset}&limit=${limit}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`
      }
    }
  );
}

export async function getNFTCollectionOwners(
  guid: any,
  offset: number = 0,
  limit: number = 0
): Promise<BaseplateResp> {
  return request(
    `${
      process.env.REACT_APP_PROFILE_API_SERVICE_URL
    }/v1/nft_collection_router/owners?collection_id=${JSON.stringify(
      guid
    )}&offset=${offset}&limit=${limit}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`
      }
    }
  );
}

export async function getNFTCollectionValidateForm(
  forminfo: any
): Promise<BaseplateResp> {
  return request(
    `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/nft_collection_router/validateform?forminfo=${JSON.stringify(forminfo)}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`
      }
    }
  );
}
