import Link from 'next/link';
import formatDate from '@/utils/libs';
import CancelBookingBtn from '@/components/CancelBookingBtn';

interface BookedRoomCardProps {
  room_id: {
    name: string;
    $id: string;
  };
  check_in: string;
  check_out: string;
  $id: string;
}

const BookedRoomCard = ({ booking }: { booking: BookedRoomCardProps }) => {
  const { room_id: room } = booking;

  return (
    <div className='bg-white shadow rounded-lg p-4 mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center'>
      <div>
        <h4 className='text-lg font-semibold'>{room.name}</h4>
        <p className='text-sm text-gray-600'>
          <strong>Check In:</strong> {formatDate(new Date(booking.check_in))}
        </p>
        <p className='text-sm text-gray-600'>
          <strong>Check Out:</strong> {formatDate(new Date(booking.check_out))}
        </p>
      </div>
      <div className='flex flex-col sm:flex-row w-full sm:w-auto sm:space-x-2 mt-2 sm:mt-0'>
        <Link
          href={`/rooms/${room.$id}`}
          className='bg-blue-500 text-white px-4 py-2 rounded mb-2 sm:mb-0 w-full sm:w-auto text-center hover:bg-blue-700'
        >
          View Room
        </Link>
        <CancelBookingBtn bookingId={booking.$id} />
      </div>
    </div>
  );
};

export default BookedRoomCard;
