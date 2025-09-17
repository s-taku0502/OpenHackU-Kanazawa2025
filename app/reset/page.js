"use client";
import { getAuth, confirmPasswordReset } from "firebase/auth";
import "../firebase";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function PasswordResetConfirm() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const auth = getAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const oobCode = searchParams.get("oobCode");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        if (!oobCode) {
            setMessage("エラー: リンクが無効です。再度メールからアクセスしてください。");
            return;
        }
        if (password !== confirmPassword) {
            setMessage("エラー: パスワードが一致しません。");
            return;
        }
        try {
            await confirmPasswordReset(auth, oobCode, password);
            setMessage("パスワードが再設定されました。ログイン画面からサインインしてください。");
        } catch (error) {
            setMessage("エラー: " + error.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: "#FFF7EE" }}>
            <h1 className="text-3xl font-bold mb-8">新しいパスワード設定</h1>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 p-8 rounded-lg bg-transparent items-center justify-center"
            >
                <div className="w-full text-left mb-2">
                    <p>
                        新しいパスワードを入力してください。<br />
                        パスワードは6文字以上で設定してください。
                    </p>
                </div>
                <div>
                    <p>新しいパスワード</p>
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
                        type="password"
                        placeholder="新しいパスワード"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={6}
                        required
                    />
                </div>
                <div>
                    <p>新しいパスワード（確認）</p>
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
                        type="password"
                        placeholder="新しいパスワード（確認）"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        minLength={6}
                        required
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="px-6 py-2 mx-8 text-white font-bold hover:opacity-90 transition mx-auto block"
                        style={{
                            borderRadius: "25px",
                            background: "#FF9F1C",
                        }}
                    >
                        パスワードを再設定
                    </button>
                </div>
                <div className={message.startsWith("エラー") ? "text-red-500" : "text-green-600"}>{message}</div>
                <div>
                    <Link href="/login" className="text-blue-500 underline">ログイン画面に戻る</Link>
                </div>
            </form>
        </div>
    );
}
