import type { Handler } from '@netlify/functions';
import type { GitHubIssuePayload, GitHubStarPayload } from '../../../src/interfaces/index.js';

const notify = async (message: string): Promise<boolean> => {
  const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!discordWebhookUrl) return false;

  const response = await fetch(discordWebhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: message }),
  });

  return response.ok;
};

const onStar = ({ action, sender, repository }: GitHubStarPayload): string =>
  `User ${sender.login} ${action} star on ${repository.full_name}`;

const onIssue = ({ action, issue }: GitHubIssuePayload): string => {
  if (action === 'opened') return `An issue was opened with this title ${issue.title}`;
  if (action === 'closed') return `An issue was closed by ${issue.user.login}`;
  if (action === 'reopened') return `An issue was reopened by ${issue.user.login}`;

  return `Unhandled action for the issue event ${action}`;
};

const handler: Handler = async (event) => {
  const githubEvent = event.headers['x-github-event'] ?? 'unknown';
  const payload: unknown = JSON.parse(event.body ?? '{}');
  let message: string;

  switch (githubEvent) {
    case 'star':
      message = onStar(payload as GitHubStarPayload);
      break;
    case 'issues':
      message = onIssue(payload as GitHubIssuePayload);
      break;
    default:
      message = `Unknown event ${githubEvent}`;
  }

  const notified = await notify(message);

  if (!notified) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: 'Unable to notify Discord' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'done' }),
    headers: { 'Content-Type': 'application/json' },
  };
};

export { handler };
