'use server';

import { createSessionClient } from '@/config/appwrite';
import { cookies } from 'next/headers';
import { Query } from 'node-appwrite';
import { redirect } from 'next/navigation';
import { Room } from '@/types/room';

async function getMyRooms() {
  const sessionCookie = cookies().get('appwrite-session');

  if (!sessionCookie) {
    redirect('/login');
  }

  try {
    const { account, databases } = await createSessionClient(
      sessionCookie.value
    );

    //get user's id
    const user = await account.get();
    const userId = user.$id;

    //fetch rooms collection
    const { documents: rooms } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE as string,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS as string,
      [Query.equal('user_id', userId)]
    );

    return rooms.map(
      (room): Room => ({
        $id: room.$id,
        user_id: room.user_id || '',
        name: room.name || 'Unnamed Room',
        description: room.description || '',
        sqft: room.sqft || 0,
        address: room.address || 'Unknown Address',
        availability: room.availability || 'Unavailable',
        price_per_hour: room.price_per_hour || 0,
        image: room.image || 'default.jpg',
        capacity: room.capacity || 0,
        location: room.location || '',
        amenities: room.amenities || '',
      })
    );
  } catch (err) {
    console.log('Failed to get user rooms', err);
    redirect('/err');
  }
}

export default getMyRooms;
