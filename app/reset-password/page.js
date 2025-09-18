"use client";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import "../firebase";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const auth = getAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            // Firebase AuthenticationのsendPasswordResetEmailを直接呼び出す
            await sendPasswordResetEmail(auth, email);

            // 成功メッセージを表示
            setMessage("パスワード再設定用のメールを送信しました。メールをご確認ください。");

        } catch (error) {
            // 未登録ユーザーの場合でも、具体的なエラーメッセージは表示しない
            setMessage("パスワード再設定用のメールを送信しました。メールをご確認ください。");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: "#FFF7EE" }}>
            <h1 className="text-3xl font-bold mb-8">パスワード再設定</h1>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 p-8 rounded-lg bg-transparent items-center justify-center"
            >

                <div className="w-full text-left mb-2">
                    <p>
                        パスワード再設定用のメールを送信します。<br />
                        メールアドレスをご記入ください。
                    </p>
                </div>

                <br />

                <div>
                    <p>メールアドレス</p>
                    <input
                        className="px-4 py-2 focus:outline-none"
                        style={{
                            borderRadius: "25px",
                            border: "1px solid #EDEDED",
                            background: "#FFF",
                            blockSize: "35px",
                            alignSelf: "stretch",
                            inlineSize: "80vw",
                            maxInlineSize: "500px",
                        }}
                        type="email"
                        placeholder="sample@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="px-6 py-2 mx-8 text-black font-bold hover:opacity-90 transition mx-auto block"
                        style={{
                            borderRadius: "25px",
                            background: "#FF9F1C",
                        }}
                    >
                        再設定メールを送信
                    </button>
                </div>
                <div className="text-green-600">{message}</div>
                <div>
                    <Link href="/login" className="text-blue-500 underline">ログイン画面に戻る</Link>
                </div>
            </form>
        </div>
    );
}
