'use server';

import { createAdminClient } from '@/config/appwrite';
import { cookies } from 'next/headers';

type SessionResponse = {
  success?: string;
  error?: string;
};

async function createSession(
  prevState: any,
  formData: FormData
): Promise<SessionResponse> {
  const email = formData.get('email') as string | null;
  const password = formData.get('password') as string | null;

  console.log(email, password);

  if (!email || !password) {
    return {
      error: 'Please fill in all fields',
    };
  }

  //get account instance
  const { account } = await createAdminClient();

  try {
    //create session
    const session = await account.createEmailPasswordSession(email, password);

    //create cookie
    cookies().set('appwrite-session', session.secret, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(session.expire),
      path: '/',
    });

    return {
      success: 'Logged in successfully',
    };
  } catch (err) {
    console.log('Authentication Error', err);
    return {
      error: 'Invalid Credentials',
    };
  }
}

export default createSession;
