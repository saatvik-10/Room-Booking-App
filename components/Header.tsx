'use client';

import Image from 'next/image';
import Link from 'next/link';
import logo from '@/assets/images/logo.png';
import { FaUser, FaSignInAlt, FaSignOutAlt, FaBuilding } from 'react-icons/fa';
import destroySession from '@/app/actions/destroySession';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/authContext';

const Header: React.FC = () => {
  const route = useRouter();

  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const handleLogout = async () => {
    const { success, error } = await destroySession();
    if (success) {
      setIsAuthenticated(false);
      route.push('/');
    } else {
      toast.error(error);
    }
  };

  return (
    <header className='bg-blue-100'>
      <nav className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          <div className='flex items-center'>
            <Link href='/'>
              <Image
                className='h-12 w-12'
                src={logo}
                alt='Roomify'
                priority={true}
              />
            </Link>
            <div className='hidden md:block'>
              <div className='ml-10 flex items-baseline space-x-4'>
                <Link
                  href='/'
                  className='rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-700 hover:text-white'
                >
                  Rooms
                </Link>

                {isAuthenticated && (
                  <div>
                    <Link
                      href='/bookings'
                      className='rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-700 hover:text-white'
                    >
                      Bookings
                    </Link>
                    <Link
                      href='/rooms/add'
                      className='rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-700 hover:text-white'
                    >
                      Add Room
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='ml-auto'>
            <div className='ml-4 flex items-center md:ml-6'>
              {!isAuthenticated && (
                <div>
                  <Link
                    href='/login'
                    className='mr-3 text-gray-800 hover:text-gray-600'
                  >
                    <FaSignInAlt className='inline mr-1' /> Login
                  </Link>
                  <Link
                    href='/register'
                    className='mr-3 text-gray-800 hover:text-gray-600'
                  >
                    <FaUser className='inline mr-1' /> Register
                  </Link>
                </div>
              )}

              {isAuthenticated && (
                <div>
                  <Link href='/rooms/my'>
                    <FaBuilding className='inline mr-1' /> My Rooms
                  </Link>
                  <button
                    onClick={handleLogout}
                    className='mx-3 text-gray-800 hover:text-gray-600'
                  >
                    <FaSignOutAlt className='inline mr-1' /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* //Mobile menu */}
      <div className='md:hidden'>
        <div className='space-y-1 px-2 pb-3 pt-2 sm:px-3'>
          <Link
            href='/'
            className='block rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white'
          >
            Rooms
          </Link>

          {isAuthenticated && (
            <div>
              <Link
                href='/bookings'
                className='block rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white'
              >
                Bookings
              </Link>
              <Link
                href='/rooms/add'
                className='block rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white'
              >
                Add Room
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
