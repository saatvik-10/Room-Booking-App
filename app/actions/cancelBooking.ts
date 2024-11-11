'use server';

import { createSessionClient } from '@/config/appwrite';
import checkAuth from './checkAuth';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function cancelBooking({ bookingId }: { bookingId: string }) {
  const sessionCookie = cookies().get('appwrite-session');

  if (!sessionCookie) {
    redirect('/login');
  }

  try {
    const { databases } = await createSessionClient(sessionCookie.value);

    //get user's id
    const user = await checkAuth();

    if (!user) {
      return {
        error: 'You must be logged in to cancel a booking',
      };
    }

    //get booking
    const booking = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE as string,
      process.env.NEXT_PUBLIC_APPWRITE_BOOKINGS as string,
      bookingId
    );

    //check if booking exists for current user
    if (!user.user || booking.user_id !== user.user.id) {
      return {
        error: 'You are not authorized to cancel this booking',
      };
    }

    //cancel boooking
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE as string,
      process.env.NEXT_PUBLIC_APPWRITE_BOOKINGS as string,
      bookingId
    );

    revalidatePath('/bookings', 'layout');

    return {
      success: true,
    };
  } catch (err) {
    console.log('Failed to cancel booking', err);
    return {
      error: 'Failed to cancel booking',
    };
  }
}

export default cancelBooking;
