const lastTicket = document.querySelector('#last-ticket');
const currentTicket = document.querySelector('#current-ticket');
const pendingCount = document.querySelector('#pending-count');
const workingTickets = document.querySelector('#working-tickets');
const deskInput = document.querySelector('#desk');
const status = document.querySelector('#status');
const feedback = document.querySelector('#feedback');
const createButton = document.querySelector('#create-ticket');
const drawButton = document.querySelector('#draw-ticket');
const finishButton = document.querySelector('#finish-ticket');
let activeTicket;

const request = async (url, options) => {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message ?? data.error ?? 'La operación no se pudo completar');
  return data;
};

const renderWorkingTickets = (tickets) => {
  workingTickets.replaceChildren();
  if (!tickets.length) {
    const empty = document.createElement('li');
    empty.className = 'empty';
    empty.textContent = 'Aún no hay turnos en atención.';
    workingTickets.append(empty);
    return;
  }
  tickets.forEach((ticket) => {
    const item = document.createElement('li');
    const number = document.createElement('span');
    const desk = document.createElement('span');
    number.textContent = `Turno ${ticket.number}`;
    desk.textContent = `Escritorio ${ticket.handledAtDesk}`;
    item.append(number, desk);
    workingTickets.append(item);
  });
};

const run = async (operation) => {
  feedback.textContent = '';
  try { await operation(); } catch (error) { feedback.textContent = error.message; }
};

createButton.addEventListener('click', () => run(async () => {
  const ticket = await request('/api/ticket', { method: 'POST' });
  lastTicket.textContent = ticket.number;
}));

drawButton.addEventListener('click', () => run(async () => {
  const desk = deskInput.value.trim();
  if (!desk) throw new Error('Indica un escritorio');
  if (activeTicket) await request(`/api/ticket/done/${activeTicket.id}`, { method: 'PUT' });
  const result = await request(`/api/ticket/draw/${encodeURIComponent(desk)}`);
  activeTicket = result.ticket;
  currentTicket.textContent = `Turno ${activeTicket.number}`;
}));

finishButton.addEventListener('click', () => run(async () => {
  if (!activeTicket) throw new Error('No hay un turno activo');
  await request(`/api/ticket/done/${activeTicket.id}`, { method: 'PUT' });
  activeTicket = undefined;
  currentTicket.textContent = 'Ninguno';
}));

const connect = () => {
  const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
  const socket = new WebSocket(`${protocol}//${location.host}/ws`);
  socket.addEventListener('open', () => { status.textContent = 'Online'; status.classList.add('online'); });
  socket.addEventListener('close', () => { status.textContent = 'Offline'; status.classList.remove('online'); setTimeout(connect, 1500); });
  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data);
    if (message.type === 'on-ticket-count-changed') pendingCount.textContent = message.payload;
    if (message.type === 'on-working-changed') renderWorkingTickets(message.payload);
  });
};

Promise.all([
  request('/api/ticket/last').then((number) => { lastTicket.textContent = number; }),
  request('/api/ticket/pending').then((tickets) => { pendingCount.textContent = tickets.length; }),
  request('/api/ticket/working-on').then(renderWorkingTickets),
]).catch((error) => { feedback.textContent = error.message; });
connect();
