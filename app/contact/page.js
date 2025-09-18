"use client";
import { useState } from "react";

export default function Contact() {
	const [type, setType] = useState("");
	const [nickname, setNickname] = useState("");
	const [email, setEmail] = useState("");
	const [content, setContent] = useState("");
	const [message, setMessage] = useState("");

	const isFormFilled = type && nickname && email && content;

	const handleSubmit = async (e) => {
		e.preventDefault();
		// バリデーション（メール形式チェックなどは省略）
		if (!isFormFilled) {
			setMessage("全ての項目を入力してください");
			return;
		}
		setMessage("送信中...");

		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ type, nickname, email, content }),
			});

			if (res.ok) {
				// alertの代わりにsetMessageを使用
				setMessage("お問い合わせを送信しました。ありがとうございました！");
				setType("");
				setNickname("");
				setEmail("");
				setContent("");
			} else {
				setMessage("送信に失敗しました。時間をおいて再度お試しください。");
			}
		} catch (error) {
			console.error("Contact form submission error:", error);
			setMessage("送信中にエラーが発生しました。ネットワーク接続を確認して再度お試しください。");
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: "#FFF7EE" }}>
			<form
				onSubmit={handleSubmit}
				className="flex flex-col gap-4 p-8 rounded-lg bg-transparent items-center justify-center"
				style={{ width: "100%", maxWidth: 500 }}
			>
				<h1 className="text-2xl font-bold text-center text-black mb-2">お問い合わせ</h1>
				<div className="w-full">
					<p>お問い合わせ内容の種類</p>
					<select
						className="px-4 py-2 focus:outline-none w-full"
						style={{
							borderRadius: "25px",
							border: "1px solid #EDEDED",
							background: "#FFF",
							blockSize: "35px",
						}}
						value={type}
						onChange={e => setType(e.target.value)}
						required
					>
						<option value="" disabled>選択してください</option>
						<option value="webサイトへのご意見">webサイトへのご意見</option>
						<option value="相談・質問">相談・質問</option>
						<option value="その他">その他</option>
					</select>
				</div>
				<div className="w-full">
					<p>ニックネーム</p>
					<input
						className="px-4 py-2 focus:outline-none w-full"
						style={{
							borderRadius: "25px",
							border: "1px solid #EDEDED",
							background: "#FFF",
							blockSize: "35px",
						}}
						type="text"
						placeholder="ニックネーム"
						value={nickname}
						onChange={e => setNickname(e.target.value)}
						required
					/>
				</div>
				<div className="w-full">
					<p>メールアドレス</p>
					<input
						className="px-4 py-2 focus:outline-none w-full"
						style={{
							borderRadius: "25px",
							border: "1px solid #EDEDED",
							background: "#FFF",
							blockSize: "35px",
						}}
						type="email"
						placeholder="sample@example.com"
						value={email}
						onChange={e => setEmail(e.target.value)}
						required
					/>
				</div>
				<div className="w-full">
					<p>お問い合わせ内容</p>
					<textarea
						className="px-4 py-2 focus:outline-none w-full"
						style={{
							borderRadius: "25px",
							border: "1px solid #EDEDED",
							background: "#FFF",
							minHeight: "100px",
						}}
						placeholder="お問い合わせ内容を入力してください"
						value={content}
						onChange={e => setContent(e.target.value)}
						required
					/>
				</div>
				<div className="w-full">
					<button
						type="submit"
						className={`px-6 py-2 text-black font-bold transition mx-auto block w-full ${!isFormFilled ? 'grayscale opacity-60 cursor-not-allowed' : 'hover:opacity-90'}`}
						style={{
							borderRadius: "25px",
							background: "#FF9F1C",
						}}
						disabled={!isFormFilled}
					>
						送信
					</button>
				</div>
				{message && <div className="text-red-500">{message}</div>}
			</form>
		</div>
	);
}
