import type { Handler } from '@netlify/functions';

const handler: Handler = async () => {
  const myImportantVariable = process.env.MY_IMPORTANT_VARIABLE;

  if (!myImportantVariable) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing MY_IMPORTANT_VARIABLE' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ myImportantVariable }),
    headers: { 'Content-Type': 'application/json' },
  };
};

export { handler };
