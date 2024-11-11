'use server';

import { createAdminClient } from '@/config/appwrite';
import checkAuth from './checkAuth';
import { ID } from 'node-appwrite';
import { revalidatePath } from 'next/cache';

async function createRoom(prevState: { message: string }, formData: FormData) {
  //get database instance
  const { databases, storage } = await createAdminClient();

  try {
    const { user } = await checkAuth();

    if (!user) {
      throw new Error('Login to create a room');
    }

    //upload image
    let imageID;
    const image = formData.get('image') as File;
    if (image && image.size > 0 && image.name !== 'undefined') {
      try {
        //upload
        const response = await storage.createFile(
          'roomify',
          ID.unique(),
          image as File
        );
        imageID = response.$id; //will go in database
      } catch (err) {
        console.log('Error uploading image', err);
        return {
          err: 'Error uploading image',
        };
      }
    } else {
      console.log('No image provided or File is invalid');
    }

    //create room
    const newRoom = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE as string,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS as string,
      // process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ROOMS as string,
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
        amenities: formData.get('amenities') as string,
        image: imageID,
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

export default createRoom;
