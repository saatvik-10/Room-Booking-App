'use client';

import cancelBooking from '@/app/actions/cancelBooking';
import { toast } from 'react-toastify';

const CancelBookingBtn = ({ bookingId }: { bookingId: string }) => {
  const handleCancelBooking = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    try {
      const res = await cancelBooking({ bookingId });

      if (res.success) {
        toast.success('Booking cancelled successfully');
      }
    } catch (err) {
      console.log('Failed to cancel booking', err);
      return {
        error: 'Failed to cancel booking',
      };
    }
  };

  return (
    <button
      onClick={handleCancelBooking}
      className='bg-red-500 text-white px-4 py-2 rounded w-full sm:w-auto text-center hover:bg-red-700'
    >
      Cancel Booking
    </button>
  );
};

export default CancelBookingBtn;
