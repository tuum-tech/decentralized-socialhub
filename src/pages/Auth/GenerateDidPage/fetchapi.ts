import { TuumTechScriptService } from 'src/services/script.service';

export async function getUsersWithRegisteredEmail(email: string) {
  let prevUsers = [];
  prevUsers = await TuumTechScriptService.getUsersWithRegisteredEmail(email);
  return prevUsers;
}
