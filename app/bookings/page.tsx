import Heading from "@/components/Heading";
import getMyBookings from "@/app/actions/getMyBooking";

const BookingPage = async() => {
    const bookings = await getMyBookings();

    return ( 
        <div>
            {Array.isArray(bookings) ? (
                bookings.length === 0 ? (
                    <p className="text-gray-600 mt-4">
                        You have no bookings.
                    </p>
                ) : (
                    bookings.map((booking)=><h3>{booking.room_id.name}</h3>)
                )
            ) : (
                <p className="text-red-600 mt-4">
                    {bookings.error}
                </p>
            )}
        </div>
     );
}
 
export default BookingPage;