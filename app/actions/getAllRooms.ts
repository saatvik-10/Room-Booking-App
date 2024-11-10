'use server';

import { createAdminClient } from '@/config/appwrite';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Room } from '@/types/room';

async function getAllRooms() {
  try {
    const { databases } = await createAdminClient();

    //fetch rooms collection
    const { documents: rooms } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE as string,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS as string
    );

    //revalidate the cache for this path
    revalidatePath('/', 'layout');

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
    console.log('Failed to get rooms', err);
    redirect('/err');
  }
}

export default getAllRooms;
