'use server';

import { createSessionClient } from '@/config/appwrite';
import { cookies } from 'next/headers';
import { Query } from 'node-appwrite';
import { redirect } from 'next/navigation';
import checkAuth from '@/app/actions/checkAuth';
import { Room } from '@/types/room';

async function getMyBookings() {
  const sessionCookie = cookies().get('appwrite-session');

  if (!sessionCookie) {
    redirect('/login');
  }

  try {
    const { databases } = await createSessionClient(
      sessionCookie.value
    );

    //get user's id
    const { user } = await checkAuth();

    if (!user) {
      return {
        error: 'You  must be logged in to view bookings',
      };
    }

    //fetch user bookings
    const { documents: bookings } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE as string,
      process.env.NEXT_PUBLIC_APPWRITE_BOOKINGS as string,
      [Query.equal('user_id', user.id)]
    );

    return bookings;
  } catch (err) {
    console.log('Failed to get user get user bookings', err);
    return {
      error: 'Failed to get user bookings',
    };
  }
}

export default getMyBookings;
