import { SpaceService } from 'src/services/space.service';

export function fetchSpacesApi(
  session?: ISessionItem | undefined
): Promise<Space[]> {
  return SpaceService.getAllSpaces(session);
}
