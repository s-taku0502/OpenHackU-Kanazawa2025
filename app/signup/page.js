"use client";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const auth = getAuth();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    // 全ての項目が入力されているか判定
    const [agreed, setAgreed] = useState(false);
    const isFormFilled = name && email && password && confirmPassword && agreed;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("エラー: パスワードが一致しません");
            return;
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                name: name,
                groupIds: [],
            });

            router.push("/");
        } catch (error) {
            setMessage("エラー: " + error.message);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: "#FFF7EE" }}>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 p-8 rounded-lg bg-transparent items-center justify-center"
            >
                <h1 className="text-2xl font-bold text-center text-black mb-2">新規登録</h1>
                <div>
                    <p>名前</p>
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
                        type="text"
                        placeholder="名前"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

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
                    <p>パスワード（6文字以上）</p>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
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
                            type={showPassword ? "text" : "password"}
                            placeholder="パスワード（6文字以上）"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            style={{
                                position: 'absolute',
                                insetInlineEnd: 12,
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                cursor: 'pointer',
                                outline: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                blockSize: '100%'
                            }}
                            tabIndex={-1}
                            aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示"}
                        >
                            {showPassword ? (
                                // eye-off icon
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="gray"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4.03-9-7 0-1.13.47-2.24 1.32-3.32m2.1-2.1C7.97 5.47 9.08 5 10.2 5c1.13 0 2.24.47 3.32 1.32m2.1 2.1C18.53 7.97 19 9.08 19 10.2c0 1.13-.47 2.24-1.32 3.32m-2.1 2.1C16.03 18.53 14.92 19 13.8 19c-1.13 0-2.24-.47-3.32-1.32m-2.1-2.1C5.47 16.03 5 14.92 5 13.8c0-1.13.47-2.24 1.32-3.32m2.1-2.1C7.97 5.47 9.08 5 10.2 5c1.13 0 2.24.47 3.32 1.32" /></svg>
                            ) : (
                                // eye icon
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="gray"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            )}
                        </button>
                    </div>
                </div>

                <div>
                    <p>確認用パスワード（6文字以上）</p>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
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
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="パスワード（6文字以上）"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            style={{
                                position: 'absolute',
                                insetInlineEnd: 12,
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                cursor: 'pointer',
                                outline: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                blockSize: '100%'
                            }}
                            tabIndex={-1}
                            aria-label={showConfirmPassword ? "パスワードを隠す" : "パスワードを表示"}
                        >
                            {showConfirmPassword ? (
                                // eye-off icon
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="gray"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4.03-9-7 0-1.13.47-2.24 1.32-3.32m2.1-2.1C7.97 5.47 9.08 5 10.2 5c1.13 0 2.24.47 3.32 1.32m2.1 2.1C18.53 7.97 19 9.08 19 10.2c0 1.13-.47 2.24-1.32 3.32m-2.1 2.1C16.03 18.53 14.92 19 13.8 19c-1.13 0-2.24-.47-3.32-1.32m-2.1-2.1C5.47 16.03 5 14.92 5 13.8c0-1.13.47-2.24 1.32-3.32m2.1-2.1C7.97 5.47 9.08 5 10.2 5c1.13 0 2.24.47 3.32 1.32" /></svg>
                            ) : (
                                // eye icon
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="gray"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            )}
                        </button>
                    </div>
                </div>
                <div className="flex items-center mb-2">
                    <input
                        type="checkbox"
                        id="agree"
                        checked={agreed}
                        onChange={e => setAgreed(e.target.checked)}
                        className="mr-2"
                    />
                    <label htmlFor="agree" className="text-sm select-none">
                        利用規約に同意する（<a href="/terms" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">利用規約</a>）
                    </label>
                </div>
                <div>
                    <button
                        type="submit"
                        className={`px-6 py-2 text-white font-bold transition mx-auto block ${!isFormFilled ? 'grayscale opacity-60 cursor-not-allowed' : 'hover:opacity-90'}`}
                        style={{
                            borderRadius: "25px",
                            background: "#FF9F1C",
                        }}
                        disabled={!isFormFilled}
                    >
                        登録
                    </button>
                </div>
                <div className="text-red-500">{message}</div>
                すでにアカウントをお持ちの方は
                <a href="/signin" className="text-blue-600 underline">サインイン</a>
            </form>
        </div>
    );
}