import { SpaceService } from 'src/services/space.service';

export function fetchSpacesApi(
  session?: ISessionItem | undefined
): Promise<Space[]> {
  return SpaceService.getAllSpaces(session);
}

export function updateSpaceApi(
  session: ISessionItem,
  space: Space,
  notify: boolean = true
) {
  return SpaceService.addSpace(session, space, notify);
}

export function removeSpaceApi(session: ISessionItem, space: Space) {
  console.log('remove space - ', space);
  return SpaceService.removeSpace(session, space);
}
