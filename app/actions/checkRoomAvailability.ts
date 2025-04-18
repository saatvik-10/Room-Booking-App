'use server';

import { createSessionClient } from '@/config/appwrite';
import { cookies } from 'next/headers';
import { Query } from 'node-appwrite';
import { redirect } from 'next/navigation';
import { DateTime } from 'luxon';

//convert date string to luxon DateTime
function toISTDateTime(dateString: string) {
  return DateTime.fromISO(dateString, { zone: 'Asia/Kolkata' }).setZone(
    'Asia/Kolkata'
  );
}

//checkfor overlapped bookings
function dateRangesOverlap(
  checkInA: DateTime,
  checkOutA: DateTime,
  checkInB: DateTime,
  checkOutB: DateTime
): boolean {
  return checkInA < checkOutB && checkOutA > checkInB;
}

async function checkRoomAvailability({
  roomId,
  checkIn,
  checkOut,
}: {
  roomId: string;
  checkIn: string;
  checkOut: string;
}) {
  const sessionCookie = cookies().get('appwrite-session');

  if (!sessionCookie) {
    redirect('/login');
  }

  try {
    const { databases } = await createSessionClient(sessionCookie.value);

    const checkInDateTime = toISTDateTime(checkIn);
    const checkOutDateTime = toISTDateTime(checkOut);

    //fetch all bookings for a room
    const { documents: bookings } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE as string,
      process.env.NEXT_PUBLIC_APPWRITE_BOOKINGS as string,
      [Query.equal('room_id', roomId)]
    );

    //loop and check for overlaps, data in backend
    for (const booking of bookings) {
      const bookingCheckInDateTime = toISTDateTime(booking.check_in);
      const bookingCheckOutDateTime = toISTDateTime(booking.check_out);

      if (
        dateRangesOverlap(
          checkInDateTime,
          checkOutDateTime,
          bookingCheckInDateTime,
          bookingCheckOutDateTime
        )
      ) {
        return false; //overlap found, do not found
      }
    }

    //no overlap found, continue booking
    return true;
  } catch (err) {
    console.log('Failed to check availability', err);
    return {
      error: 'Failed to check availability',
    };
  }
}

export default checkRoomAvailability;
