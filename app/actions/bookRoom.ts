'use server';

import { createSessionClient } from '@/config/appwrite';
import { cookies } from 'next/headers';
import { ID } from 'node-appwrite';
import { redirect } from 'next/navigation';
import checkAuth from '@/app/actions/checkAuth';
import checkRoomAvailability from '@/app/actions/checkRoomAvailability';
import { revalidatePath } from 'next/cache';

type SessionResponse = {
  success?: string;
  error?: string;
};

async function bookRoom(
  prevState: any,
  formData: FormData
): Promise<SessionResponse> {
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

    const roomId = formData.get('room_id') as string;

    //combine date and time to ISO 8061 format
    const checkInDateTime = `${checkInDate}T${checkInTime}`;
    const checkOutDateTime = `${checkOutDate}T${checkOutTime}`;

    //check if room is available
    const isAvailable = await checkRoomAvailability({
      roomId,
      checkIn: checkInDateTime,
      checkOut: checkOutDateTime,
    });

    if (!isAvailable) {
      return {
        error: 'Room is already booked for the selected dates',
      };
    }

    const bookingData = {
      check_in: checkInDateTime,
      check_out: checkOutDateTime,
      user_id: user.id,
      room_id: roomId,
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
      success: 'Room booked successfully',
    };
  } catch (err) {
    console.log('Failed to book rooms', err);
    return {
      error: 'Something went wrong while booking the room',
    };
  }
}

export default bookRoom;
