import type { Handler } from '@netlify/functions';

const handler: Handler = async () => ({
  statusCode: 200,
  body: JSON.stringify({ message: 'Hola Mundo!!' }),
  headers: { 'Content-Type': 'application/json' },
});

export { handler };
