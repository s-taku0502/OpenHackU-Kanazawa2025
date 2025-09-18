export async function POST(req) {
  const body = await req.json();
  const { type, nickname, email, content } = body;

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  const message = {
    content: `**お問い合わせ内容の種類:** ${type}\n**ニックネーム:** ${nickname}\n**メールアドレス:** ${email}\n**お問い合わせ内容:**\n${content}`,
  };

  const discordRes = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });

  if (discordRes.ok) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } else {
    return new Response(JSON.stringify({ ok: false }), { status: 500 });
  }
}