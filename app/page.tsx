import RoomCard from '@/components/RoomCard';
import rooms from '@/data/rooms.json';

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
      {rooms.length > 0 ? (
        rooms.map((room) => <RoomCard room={room} />)
      ) : (
        <p>No rooms available</p>
      )}
    </div>
  );
}
