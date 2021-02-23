import request from 'src/baseplate/request';
import { UserService } from 'src/services/user.service';

export async function checkIfEmailAlreadyRegistered(
  email: string,
  service: string
) {
  const get_users_scripts = {
    name: 'get_users',
    params: {
      email: email,
    },
    context: {
      target_did: process.env.REACT_APP_APPLICATION_DID,
      target_app_did: process.env.REACT_APP_APPLICATION_ID,
    },
  };

  // check if this email is already registered on tuum.tech vault
  const get_users_script_response: any = await request(
    `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/api/tuumvault_router/scripting/run_script`,
    {
      method: 'POST',
      headers: {
        Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`,
        Accept: 'application/json',
        charset: 'utf8',
        'content-type': 'application/json',
      },
      body: JSON.stringify(get_users_scripts),
    }
  );
  console.log('=====>get_users_script_response', get_users_script_response);
  let prevUser: any = null;
  if (get_users_script_response) {
    const { meta, data } = get_users_script_response;
    if (meta && meta.code === 200 && meta.message === 'OK') {
      const { get_users } = data;
      if (get_users && get_users.items && get_users.items.length > 0) {
        prevUser = get_users.items[0];
      }
    } else {
      throw new Error('Error while running get_users script');
    }
  }

  const localUsers = UserService.getSignedUsers();
  if (localUsers.length === 0) {
    console.log('=====>local data empty');
    prevUser = null;
  }

  return prevUser;
}
