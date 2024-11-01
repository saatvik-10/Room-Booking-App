'use server';

import { createSessionClient } from '@/config/appwrite';
import { cookies } from 'next/headers';

async function checkAuth() {
  //Retrieve the session cookie
  const sessionCookie = cookies().get('appwrite-session');

  if (!sessionCookie) {
    return {
      isAuthenticated: false,
    };
  }
  try {
    const { account } = await createSessionClient(sessionCookie.value);

    //get user details
    const user = await account.get();

    return {
      isAuthenticated: true,
      user: {
        id: user.$id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (err) {
    return {
      isAuthenticated: false,
    };
  }
}

export default checkAuth;