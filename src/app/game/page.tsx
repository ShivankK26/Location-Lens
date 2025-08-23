import Game from '../components/Game';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function GamePage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/');
  }

  return <Game />;
}
