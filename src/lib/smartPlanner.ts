import { Deadline, Milestone, TimeRemaining } from '@/types';

/**
 * Creates a clean user-defined deadline with realistic default timing (14 days from now).
 */
export function createNewDeadline(
  title: string = 'Launch Project V1',
  category: Deadline['category'] = 'launch',
  targetDaysFromNow: number = 14
): Deadline {
  const now = new Date();
  const target = new Date(now.getTime() + targetDaysFromNow * 24 * 60 * 60 * 1000);

  const newDeadline: Deadline = {
    id: `dl-${Date.now()}`,
    title,
    category,
    targetDate: target.toISOString(),
    createdAt: now.toISOString(),
    description: 'High-priority milestone project. Ship on schedule with zero compromises.',
    mantra: 'Focus on the finish line.',
    milestones: [],
    briefing: {
      userName: 'Alex',
      greetingPrefix: 'Good morning',
      weather: {
        temperature: '72°',
        condition: 'partly cloudy',
        location: 'Greenpoint, Brooklyn',
        forecastNote: 'Light rain likely after 6PM, bring an umbrella',
      },
      events: [
        { id: 'ev-1', time: '9:30 AM', title: 'Team standup' },
        { id: 'ev-2', time: '1:00 PM', title: 'Lunch with Priya' },
        { id: 'ev-3', time: '4:00 PM', title: 'Dentist (20 min drive)' },
      ],
      tasks: [
        { id: 'tk-1', title: 'Send report', completed: false },
        { id: 'tk-2', title: 'Renew car registration', completed: false },
      ],
    },
  };

  newDeadline.milestones = generateBackwardMilestones(title, newDeadline.targetDate);
  return newDeadline;
}

/**
 * Calculates remaining time breakdown and percentage elapsed.
 */
export function calculateTimeRemaining(targetIso: string, createdIso?: string): TimeRemaining {
  const target = new Date(targetIso).getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      isExpired: true,
      formattedPercentage: 100,
    };
  }

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const totalSeconds = Math.floor(diff / 1000);

  let formattedPercentage = 0;
  if (createdIso) {
    const start = new Date(createdIso).getTime();
    const totalDuration = target - start;
    if (totalDuration > 0) {
      const elapsed = now - start;
      formattedPercentage = Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));
    }
  }

  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
    isExpired: false,
    formattedPercentage,
  };
}

/**
 * Generates an automatic 4-checkpoint backward milestone timeline from any given deadline.
 */
export function generateBackwardMilestones(
  title: string,
  targetIso: string
): Milestone[] {
  const now = Date.now();
  const target = new Date(targetIso).getTime();
  const totalMs = target - now;

  if (totalMs <= 0) {
    return [
      {
        id: `ms-${Date.now()}-final`,
        title: 'Final Delivery & Submission',
        description: 'Target deadline reached.',
        dueDate: targetIso,
        completed: false,
        pacingLabel: 'Final Sprint · T-0',
        estimatedHours: 1,
      },
    ];
  }

  // Backward checkpoints based on proportion of remaining time
  const checkpoints = [
    {
      ratio: 0.25,
      label: 'Architecture & Scope Lock',
      pacing: 'Phase 1 · 25%',
      hours: 3,
      desc: 'Lock in specifications, wireframes, and technical roadmap.',
    },
    {
      ratio: 0.6,
      label: 'Core Implementation Complete',
      pacing: 'Phase 2 · 60%',
      hours: 8,
      desc: 'All critical path functionality and user flows operational.',
    },
    {
      ratio: 0.85,
      label: 'Polish, QA & Real-World Testing',
      pacing: 'Phase 3 · 85%',
      hours: 4,
      desc: 'Rigorous testing, edge-case fixes, and aesthetic audit.',
    },
    {
      ratio: 0.98,
      label: 'Final Review & Release Sprint',
      pacing: 'Final Sprint · 98%',
      hours: 2,
      desc: 'Final proofread, package deliverables, and launch.',
    },
  ];

  return checkpoints.map((cp, idx) => {
    const dueTime = new Date(now + totalMs * cp.ratio).toISOString();
    return {
      id: `ms-${Date.now()}-${idx + 1}`,
      title: `${title}: ${cp.label}`,
      description: cp.desc,
      dueDate: dueTime,
      completed: false,
      pacingLabel: cp.pacing,
      estimatedHours: cp.hours,
    };
  });
}

/**
 * Builds a prompt for Google Gemini to help the user ideate or refine their backward plan.
 */
export function buildGeminiPlanningPrompt(deadline: Deadline): string {
  return `Act as an elite engineering project manager and creative director.
I am working towards a high-stakes deadline: "${deadline.title}" due on ${new Date(
    deadline.targetDate
  ).toLocaleString()}.
Category: ${deadline.category}
Goal details: ${deadline.description}

Please provide:
1. A rigorous backward-scheduled milestone timeline working backwards from my deadline to today, with exact day/hour checkpoints.
2. 3-4 daily micro-sprints that keep momentum high.
3. A focused, 6-word motivational mantra for my custom lock screen.
4. Art direction advice for a minimalist, high-contrast lock screen wallpaper that keeps this deadline top of mind every time I pick up my phone.`;
}
