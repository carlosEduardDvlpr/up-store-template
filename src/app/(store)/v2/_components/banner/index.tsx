import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function Banner() {
  return (
    <main className="h-dvh relative font-light">
      <div className="absolute inset-0">
        <Image
          src="https://pub-6ad0fa3bd4eb49fb8afd23cdc41ca727.r2.dev/b43ff7f8-47c0-4658-bb60-f4ec89ad0739"
          alt="Hero"
          fill
          className="object-cover brightness-[80%]"
          priority
        />
      </div>
    </main>
  );
}
