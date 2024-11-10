'use server';

import { createSessionClient } from '@/config/appwrite';
import { cookies } from 'next/headers';
import { Query } from 'node-appwrite';
import { redirect } from 'next/navigation';
import { Room } from '@/types/room';
import { revalidatePath } from 'next/cache';

async function deleteRoom(roomId: string) {
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

    //find room to delete
    const roomToDelete = rooms.find((room) => room.$id === roomId);

    //delete the room
    if (roomToDelete) {
      await databases.deleteDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE as string,
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS as string,
        roomToDelete.$id
      );

      //revalidate my rooms and all rooms
      revalidatePath('/rooms/my', 'layout');
      revalidatePath('/', 'layout');

      return {
        success: true,
      };
    } else {
      return {
        success: false,
        message: 'Room not found',
      };
    }
  } catch (err) {
    console.log('Failed to delete room', err);
    return {
      success: false,
      message: 'Failed to delete room',
    };
  }
}

export default deleteRoom;
