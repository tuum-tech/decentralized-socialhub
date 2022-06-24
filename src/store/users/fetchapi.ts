import { SearchService } from 'src/services/search.service';
import { getItemsFromData } from 'src/utils/script';

export async function fetchUsersByDIDsApi(
  dids: string[],
  limit: number,
  offset: number
): Promise<any> {
  const searchServiceLocal = await SearchService.getSearchServiceAppOnlyInstance();
  const usersRes = await searchServiceLocal.getUsersByDIDs(dids, limit, offset);

  return getItemsFromData(usersRes, 'get_users_by_dids');
}
