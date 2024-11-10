import Heading from '@/components/Heading';
import getMyRooms from '@/app/actions/getMyRooms';

const MyRoomsPage = async () => {
  const rooms = await getMyRooms();

  return (
    <div>
      <Heading title='My Rooms' />
      {rooms.length > 0 ? (
        rooms.map((room) => <h3>{room.name}</h3>)
      ) : (
        <p>You have no room listenings</p>
      )}
    </div>
  );
};

export default MyRoomsPage;
