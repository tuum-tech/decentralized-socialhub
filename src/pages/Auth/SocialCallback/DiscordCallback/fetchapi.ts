import request, { BaseplateResp } from 'src/baseplate/request';
import { TuumTechScriptService } from 'src/services/script.service';

export function requestDiscordToken(code: string): Promise<BaseplateResp> {
  return request(
    `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/auth/discord_callback?code=${code}`,
    {
      method: 'GET',
      headers: {
        'content-type': 'text/plain',
        Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`,
        Accept: 'application/json'
      }
    }
  );
}

export async function getUsersWithRegisteredDiscord(discord: string) {
  let prevUsers = [];
  prevUsers = await TuumTechScriptService.getUsersWithRegisteredDiscord(
    discord
  );
  return prevUsers;
}
