import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getMe } from '@/lib/api/serverApi';
import css from './page.module.css';

export const metadata: Metadata = {
  title: 'NoteHub - Profile',
  description: 'Your NoteHub profile page',
  openGraph: {
    title: 'NoteHub - Profile',
    description: 'Your NoteHub profile page',
    url: 'https://notehub.vercel.app/profile',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
      },
    ],
  },
};

export default async function ProfilePage() {
  let user = null;

  try {
    user = await getMe();
  } catch {
    user = null;
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          {user?.avatar ? (
            <Image
              src={user.avatar}
              alt="User Avatar"
              width={120}
              height={120}
              className={css.avatar}
            />
          ) : (
            <Image
              src="https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"
              alt="User Avatar"
              width={120}
              height={120}
              className={css.avatar}
            />
          )}
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user?.username ?? 'N/A'}</p>
          <p>Email: {user?.email ?? 'N/A'}</p>
        </div>
      </div>
    </main>
  );
}
