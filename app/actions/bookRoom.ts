'use server';

import { createSessionClient } from '@/config/appwrite';
import { cookies } from 'next/headers';
import { ID } from 'node-appwrite';
import { redirect } from 'next/navigation';
// import { Room } from '@/types/room';
import checkAuth from '@/app/actions/checkAuth';
import { revalidatePath } from 'next/cache';

interface SessionState {
  isAuthenticated: boolean;
}

async function bookRoom(previousState: SessionState, formData: FormData) {
  const sessionCookie = cookies().get('appwrite-session');

  if (!sessionCookie) {
    redirect('/login');
  }

  try {
    const { databases } = await createSessionClient(sessionCookie.value);

    //get user
    const { user } = await checkAuth();

    if (!user) {
      return {
        error: 'You must be logged in to book a room',
      };
    }

    //extract date and time from the form Data
    const checkInDate = formData.get('check_in_date');
    const checkOutDate = formData.get('check_out_date');
    const checkInTime = formData.get('check_in_time');
    const checkOutTime = formData.get('check_out_time');

    //combine date and time to ISO 8061 format
    const checkInDateTime = `${checkInDate}T${checkInTime}`;
    const checkOutDateTime = `${checkOutDate}T${checkOutTime}`;

    const bookingData = {
      check_in: checkInDateTime,
      check_out: checkOutDateTime,
      user_id: user.id,
      room_id: formData.get('room_id'),
    };

    //create booking
    const newBooking = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE as string,
      process.env.NEXT_PUBLIC_APPWRITE_BOOKINGS as string,
      ID.unique(),
      bookingData
    );

    //revalidate cache
    revalidatePath('/bookings', 'layout');

    return {
      success: true,
    };
  } catch (err) {
    console.log('Failed to book rooms', err);
    return {
      error: 'Something went wrong while booking the room',
    };
  }
}

export default bookRoom;