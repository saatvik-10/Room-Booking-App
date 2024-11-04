'use server';

import { createAdminClient } from '@/config/appwrite';
import { ID } from 'node-appwrite';

interface SessionState {
  isAuthenticated: boolean;
}

async function createUser(previousState: SessionState, formData: FormData) {
  const name = formData.get('name') as string | null;
  const email = formData.get('email') as string | null;
  const password = formData.get('password') as string | null;
  const confirmPassword = formData.get('confirm-password') as string | null;

  console.log(email, password, name, confirmPassword);

  if (!email || !password || !name || !confirmPassword) {
    return {
      error: 'Please fill in all fields',
    };
  }

  if (password.length < 8) {
    return {
      error: 'Password must be at least 8 characters',
    };
  }

  if (password !== confirmPassword) {
    return {
      error: 'Passwords do not match',
    };
  }

  //get account instance
  const { account } = await createAdminClient();

  try {
    //create user
    const user = await account.create(ID.unique(), email, password, name);

    return {
      success: 'User created successfully',
    };
  } catch (err) {
    console.log('Registration Error', err);
    return {
      error: 'Could not register user',
    };
  }
}

export default createUser;
