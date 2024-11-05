'use server';

import { createAdminClient } from '@/config/appwrite';
import checkAuth from './checkAuth';
import { ID } from 'node-appwrite';
import { revalidatePath } from 'next/cache';
import { create } from 'domain';

interface SessionState {
  isAuthenticated: boolean;
}

async function createRoom(previousState: SessionState, formData: FormData) {
  //get database instance
  const { database } = await createAdminClient();

  try {
    const { user } = await checkAuth();

    if (!user) {
      throw new Error('Login to create a room');
    }

    //create room
    const newRoom = await database.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS as string,
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE as string,
      ID.unique(),
      {
        user_id: user.id,
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        sqft: formData.get('sqft') as string,
        capacity: formData.get('capacity') as string,
        location: formData.get('location') as string,
        address: formData.get('address') as string,
        availability: formData.get('availability') as string,
        price_per_hour: formData.get('price_per_hour') as string,
        amenities: formData.getAll('amenities') as string[],
      }
    );

    revalidatePath('/', 'layout');

    return {
      success: true,
    };
  } catch (err) {
    console.log(err);
    const errMsg =
      (err as any).response?.message || 'An unexpected error occurred';
    return {
      err: errMsg,
    };
  }
}
