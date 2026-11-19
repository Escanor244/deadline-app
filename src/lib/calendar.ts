import { Deadline, Milestone } from '@/types';

/**
 * Formats a Date object to RFC 5545 UTC timestamp: YYYYMMDDTHHMMSSZ
 */
function formatIcsDate(date: Date): string {
  const pad = (n: number) => (n < 10 ? '0' + n : n);
  return (
    date.getUTCFullYear().toString() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    'T' +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    'Z'
  );
}

/**
 * Escapes characters for .ics text fields
 */
function escapeIcsText(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Generates an RFC 5545 iCalendar (.ics) string containing the main deadline and all milestones.
 */
export function generateIcsCalendar(deadline: Deadline): string {
  const now = new Date();
  const dtStamp = formatIcsDate(now);

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ChronoLock Studio//Deadline Countdown//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeIcsText(deadline.title)} Milestones`,
    'X-WR-TIMEZONE:UTC',
  ];

  // 1. Add Main Deadline Event
  const deadlineDate = new Date(deadline.targetDate);
  const deadlineEnd = new Date(deadlineDate.getTime() + 60 * 60 * 1000); // 1 hour duration
  const deadlineUid = `deadline-${deadline.id}-${Date.now()}@chronolock.studio`;

  lines.push(
    'BEGIN:VEVENT',
    `UID:${deadlineUid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${formatIcsDate(deadlineDate)}`,
    `DTEND:${formatIcsDate(deadlineEnd)}`,
    `SUMMARY:🔥 FINAL DEADLINE: ${escapeIcsText(deadline.title)}`,
    `DESCRIPTION:${escapeIcsText(
      `${deadline.description}\n\nMantra: ${deadline.mantra}\nCreated with ChronoLock Studio.`
    )}`,
    'STATUS:CONFIRMED',
    // 24 Hour Alarm
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:Deadline in 24 hours!',
    'TRIGGER:-PT24H',
    'END:VALARM',
    // 2 Hour Alarm
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:Deadline in 2 hours!',
    'TRIGGER:-PT2H',
    'END:VALARM',
    'END:VEVENT'
  );

  // 2. Add each milestone as a scheduled checkpoint event
  deadline.milestones.forEach((m: Milestone, idx: number) => {
    const dueDate = new Date(m.dueDate);
    const endDate = new Date(dueDate.getTime() + (m.estimatedHours || 1) * 60 * 60 * 1000);
    const uid = `milestone-${m.id}-${idx}@chronolock.studio`;

    lines.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${dtStamp}`,
      `DTSTART:${formatIcsDate(dueDate)}`,
      `DTEND:${formatIcsDate(endDate)}`,
      `SUMMARY:⚡ [${m.pacingLabel}] ${escapeIcsText(m.title)}`,
      `DESCRIPTION:${escapeIcsText(
        `${m.description}\n\nParent Project: ${deadline.title}\nEstimated: ${m.estimatedHours}h`
      )}`,
      'STATUS:CONFIRMED',
      // 2-hour Alarm
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:Milestone reminder: ${escapeIcsText(m.title)}`,
      'TRIGGER:-PT2H',
      'END:VALARM',
      'END:VEVENT'
    );
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

/**
 * Downloads the .ics file directly in the browser
 */
export function downloadIcsFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename.endsWith('.ics') ? filename : `${filename}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Creates a direct Google Calendar template web link for a milestone or main deadline
 */
export function createGoogleCalendarUrl(
  title: string,
  targetDateIso: string,
  description: string,
  durationHours: number = 1
): string {
  const start = new Date(targetDateIso);
  const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);

  const startFormatted = formatIcsDate(start);
  const endFormatted = formatIcsDate(end);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startFormatted}/${endFormatted}`,
    details: description,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
