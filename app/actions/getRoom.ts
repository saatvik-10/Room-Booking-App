'use server';

import { createAdminClient } from '@/config/appwrite';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function getRoom(id: string) {
  try {
    const { databases } = await createAdminClient();

    //fetch rooms collection
    const room = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE as string,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS as string,
      id
    );

    //revalidate the cache for this path
    revalidatePath('/', 'layout');

    return room;
  } catch (err) {
    console.log('Failed to get room', err);
    redirect('/err');
  }
}

export default getRoom;
