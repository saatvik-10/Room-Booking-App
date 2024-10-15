import RoomCard from '@/components/RoomCard';
import rooms from '@/data/rooms.json';
import Heading from '@/components/Heading';

interface Room {
  id: number;
  user_id: number;
  name: string;
  description: string;
  sqft: number;
  capacity: number;
  location: string;
  address: string;
  amenities: string;
  availability: string;
  price_per_hour: number;
  image: string;
}

export default function Home() {
  return (
    <div>
      <Heading title='Available Rooms' />
      {rooms.length > 0 ? (
        rooms.map((room) => <RoomCard room={room} key={room.$id} />)
      ) : (
        <p>No rooms available</p>
      )}
    </div>
  );
}
