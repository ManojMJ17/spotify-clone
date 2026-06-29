'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  FaSpotify,
  FaGithub,
  FaUserCircle,
  FaCalendarAlt,
  FaSignOutAlt,
} from 'react-icons/fa';
import { MdEmail, MdWorkspacePremium } from 'react-icons/md';
import {
  BsMusicNoteBeamed,
  BsHeartFill,
  BsCollectionPlay,
} from 'react-icons/bs';

import Box from '@/components/Box';
import { useUser } from '@/hooks/useUser';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

const AccountPage = () => {
  const router = useRouter();
  const supabase = useSupabaseClient();

  const { user, userDetails, subscription, isLoading } = useUser();

  const provider = useMemo(() => {
    return user?.app_metadata?.provider ?? 'Email';
  }, [user]);

  const joined = useMemo(() => {
    if (!user?.created_at) return '-';

    return new Date(user.created_at).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, [user]);

  const fullName = useMemo(() => {
    return (
      userDetails?.full_name ||
      `${userDetails?.first_name ?? ''} ${
        userDetails?.last_name ?? ''
      }`.trim() ||
      user?.email?.split('@')[0] ||
      'Spotify User'
    );
  }, [userDetails, user]);

  const initials = useMemo(() => {
    return fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }, [fullName]);

  const logout = async () => {
    await supabase.auth.signOut();

    router.refresh();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className='h-full flex items-center justify-center bg-neutral-900 text-white'>
        Loading account...
      </div>
    );
  }

  return (
    <div className='h-full overflow-y-auto bg-gradient-to-b from-emerald-900 via-black to-black text-white'>
      <div className='p-6 md:p-10'>
        <div className='flex flex-col lg:flex-row gap-8'>
          <Box className='flex-1 p-8'>
            <div className='flex flex-col md:flex-row gap-8 items-center'>
              {userDetails?.avatar_url ? (
                <Image
                  src={userDetails.avatar_url}
                  width={180}
                  height={180}
                  alt='avatar'
                  className='rounded-full object-cover border-4 border-green-500'
                />
              ) : (
                <div className='w-44 h-44 rounded-full bg-green-500 flex items-center justify-center text-6xl font-bold'>
                  {initials}
                </div>
              )}

              <div className='flex-1'>
                <div className='flex items-center gap-2 text-green-400 font-semibold uppercase tracking-widest text-sm'>
                  <FaSpotify />
                  Spotify Account
                </div>

                <h1 className='text-5xl font-black mt-3'>{fullName}</h1>

                <div className='mt-6 space-y-3'>
                  <div className='flex items-center gap-3 text-neutral-300'>
                    <MdEmail size={20} />
                    {user?.email}
                  </div>

                  <div className='flex items-center gap-3 text-neutral-300'>
                    <FaGithub size={18} />
                    {provider}
                  </div>

                  <div className='flex items-center gap-3 text-neutral-300'>
                    <FaCalendarAlt size={18} />
                    Joined {joined}
                  </div>

                  <div className='flex items-center gap-3'>
                    <MdWorkspacePremium size={22} className='text-green-500' />

                    <span className='font-semibold'>
                      {subscription ? 'Premium Member' : 'Free Account'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className='
                  mt-8
                  bg-red-500
                  hover:bg-red-600
                  transition
                  px-6
                  py-3
                  rounded-full
                  font-semibold
                  flex
                  items-center
                  gap-3
                  '
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            </div>
          </Box>
          {/* Right Section */}
          <div className='w-full lg:w-[380px] flex flex-col gap-6'>
            <Box className='p-6'>
              <h2 className='text-xl font-bold mb-5'>Listening Statistics</h2>

              <div className='grid grid-cols-2 gap-4'>
                <div className='bg-neutral-800 rounded-xl p-5 text-center hover:bg-neutral-700 transition'>
                  <BsHeartFill className='mx-auto text-green-500' size={28} />
                  <h3 className='mt-3 text-3xl font-bold'>48</h3>
                  <p className='text-neutral-400 text-sm'>Liked Songs</p>
                </div>

                <div className='bg-neutral-800 rounded-xl p-5 text-center hover:bg-neutral-700 transition'>
                  <BsCollectionPlay
                    className='mx-auto text-green-500'
                    size={28}
                  />
                  <h3 className='mt-3 text-3xl font-bold'>12</h3>
                  <p className='text-neutral-400 text-sm'>Playlists</p>
                </div>

                <div className='bg-neutral-800 rounded-xl p-5 text-center hover:bg-neutral-700 transition'>
                  <BsMusicNoteBeamed
                    className='mx-auto text-green-500'
                    size={28}
                  />
                  <h3 className='mt-3 text-3xl font-bold'>246</h3>
                  <p className='text-neutral-400 text-sm'>Streams</p>
                </div>

                <div className='bg-neutral-800 rounded-xl p-5 text-center hover:bg-neutral-700 transition'>
                  <FaSpotify className='mx-auto text-green-500' size={28} />
                  <h3 className='mt-3 text-3xl font-bold'>4h</h3>
                  <p className='text-neutral-400 text-sm'>Today</p>
                </div>
              </div>
            </Box>

            <Box className='p-6'>
              <h2 className='text-xl font-bold mb-5'>Account Status</h2>

              <div className='space-y-4'>
                <div className='flex justify-between'>
                  <span className='text-neutral-400'>Membership</span>

                  <span className='font-semibold text-green-400'>
                    {subscription ? 'Premium' : 'Free'}
                  </span>
                </div>

                <div className='flex justify-between'>
                  <span className='text-neutral-400'>Provider</span>

                  <span className='capitalize'>{provider}</span>
                </div>

                <div className='flex justify-between'>
                  <span className='text-neutral-400'>Email Verified</span>

                  <span>{user?.email_confirmed_at ? 'Yes' : 'No'}</span>
                </div>

                <div className='flex justify-between'>
                  <span className='text-neutral-400'>User ID</span>

                  <span className='text-xs truncate w-36 text-right'>
                    {user?.id}
                  </span>
                </div>
              </div>
            </Box>
          </div>
        </div>

        {/* Bottom Section */}

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8'>
          <Box className='p-6'>
            <h2 className='text-2xl font-bold mb-5'>Personal Information</h2>

            <div className='space-y-5'>
              <div>
                <p className='text-neutral-400 text-sm'>Full Name</p>

                <p className='text-lg mt-1'>{fullName}</p>
              </div>

              <div>
                <p className='text-neutral-400 text-sm'>Email</p>

                <p className='text-lg mt-1'>{user?.email}</p>
              </div>

              <div>
                <p className='text-neutral-400 text-sm'>Provider</p>

                <p className='capitalize mt-1'>{provider}</p>
              </div>

              <div>
                <p className='text-neutral-400 text-sm'>Joined</p>

                <p className='mt-1'>{joined}</p>
              </div>
            </div>
          </Box>

          <Box className='p-6'>
            <h2 className='text-2xl font-bold mb-5'>About Spotify</h2>

            <p className='leading-8 text-neutral-300'>
              Enjoy unlimited music streaming with your personal library,
              playlists and favorite artists. This page displays your account
              information and subscription status. More account management
              features like editing profile information and changing passwords
              can be added in future updates.
            </p>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
