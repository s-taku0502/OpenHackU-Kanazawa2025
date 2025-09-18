export async function POST(req) {
  try {
    // 環境変数のチェック
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("DISCORD_WEBHOOK_URL is not set.");
      return new Response(JSON.stringify({ ok: false, message: "サーバーの設定エラーです。" }), { status: 500 });
    }

    const body = await req.json();
    const { type, nickname, email, content } = body;

    // 入力値の検証
    if (!type || !nickname || !email || !content) {
      return new Response(JSON.stringify({ ok: false, message: "必須項目が不足しています。" }), { status: 400 });
    }

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
      // 詳細なエラーログ
      console.error(`Discordへの送信に失敗しました: ${discordRes.status} ${discordRes.statusText}`);
      return new Response(JSON.stringify({ ok: false, message: "メッセージの送信に失敗しました。" }), { status: 500 });
    }
  } catch (error) {
    // エラーハンドリング
    console.error("予期せぬエラーが発生しました:", error);
    return new Response(JSON.stringify({ ok: false, message: "サーバー内部でエラーが発生しました。" }), { status: 500 });
  }
}