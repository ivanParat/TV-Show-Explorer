//Server može vratiti string sa html elementima. U tom slučaju želimo prikazati odgovor na način da stvarno prikažemo te elemente, a ne samo string. No, unutar tog html-a se mogu kriti opasnosti po sigurnost. U ovom slučaju (TV Maze API) to ne bi trebao biti slučaj, ali za svaki slučaj ćemo "purificirati" html

'use client';

import DOMPurify from 'dompurify';

export default function SanitizedHTML({ html }: {html: string}) {
  const sanitized = DOMPurify.sanitize(html);

  return (
    <div
      className="text-sm leading-relaxed"
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
