'use server';

import { createAdminClient } from '@/config/appwrite';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function getAllRooms() {
  try {
    const { databases } = await createAdminClient();

    //fetch rooms collection
    const { documents: rooms } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE as string,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION as string
    );

    //revalidate the cache for this path
    revalidatePath('/', 'layout');
  } catch (err) {
    console.log('Failed to get rooms', err);
    redirect('/err');
  }
}
