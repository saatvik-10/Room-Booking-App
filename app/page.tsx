import RoomCard from '@/components/RoomCard';
import rooms from '@/data/rooms.json';
import Heading from '@/components/Heading';

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
