import Link from 'next/link';

interface AuthorProps {
  name: string;
  href: string;
}

export function Author({ name, href }: AuthorProps) {
  return (
    <Link href={href} className="flex items-center gap-3 text-sm">
      <span
        aria-hidden="true"
        className="bg-muted flex size-10 items-center justify-center rounded-full font-medium"
      >
        {name.slice(0, 2).toUpperCase()}
      </span>
      <span className="font-medium">{name}</span>
    </Link>
  );
}
