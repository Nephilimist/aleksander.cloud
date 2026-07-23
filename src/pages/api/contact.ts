import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ message: 'Wszystkie wymagane pola muszą być wypełnione.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const discordWebhookUrl = 'https://discord.com/api/webhooks/1529842007785078979/fwmCqayaiUj_BOiODdJ883jBFRMETZBBG9D_DJE6GvjD9uxwH7WnMalbZrV9O5FOk7AX';

    const embed = {
      title: '📬 Nowa wiadomość z Portfolio (aleksander.cloud)',
      color: 0x6366f1, // Indigo
      fields: [
        { name: '👤 Nadawca', value: String(name), inline: true },
        { name: '📧 E-mail', value: String(email), inline: true },
        { name: '📌 Temat', value: String(subject || 'Brak tematu'), inline: false },
        { name: '💬 Wiadomość', value: String(message), inline: false }
      ],
      timestamp: new Date().toISOString()
    };

    const discordResponse = await fetch(discordWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] })
    });

    if (!discordResponse.ok) {
      throw new Error(`Discord API error: ${discordResponse.statusText}`);
    }

    return new Response(JSON.stringify({ message: 'Wiadomość została pomyślnie wysłana!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error processing contact request:', error);
    return new Response(JSON.stringify({ message: 'Wystąpił błąd podczas wysyłania wiadomości.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
