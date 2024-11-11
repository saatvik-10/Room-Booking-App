import Heading from '@/components/Heading';
import getMyBookings from '@/app/actions/getMyBooking';
import BookedRoomCard from '@/components/BookedRoomCard';

const BookingPage = async () => {
  const bookings = await getMyBookings();

  return (
    <div>
      {Array.isArray(bookings) ? (
        bookings.length === 0 ? (
          <p className='text-gray-600 mt-4'>You have no bookings.</p>
        ) : (
          bookings.map((booking) => (
            <BookedRoomCard booking={booking} key={booking.$id} />
          ))
        )
      ) : (
        <p className='text-red-600 mt-4'>{bookings.error}</p>
      )}
    </div>
  );
};

export default BookingPage;
