'use server';

import { createSessionClient } from '@/config/appwrite';
import { cookies } from 'next/headers';

async function destroySession() {
  //Retrieve the session cookie
  const sessionCookie = cookies().get('appwrite-session');

  if (!sessionCookie) {
    return {
      error: 'No session found',
    };
  }
  try {
    const { account } = await createSessionClient(sessionCookie.value);

    //delete session session;
    await account.deleteSession('current');

    //clear session cookie
    cookies().delete('appwrite-session');

    return {
      success: 'Logged out successfully',
    };
  } catch (err) {
    return {
      error: 'Error deleting Session',
    };
  }
}

export default destroySession;
