"use client";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "../firebase";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const auth = getAuth();
    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                router.push("/");
            })
            .catch((error) => {
                setMessage("エラー: " + error.message);
            });
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: "#FFF7EE" }}>
            <h1 className="text-3xl font-bold mb-8">ログイン</h1>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 p-8 rounded-lg bg-transparent items-center justify-center"
            >
                <div>
                    <p>メールアドレス</p>
                    <input
                        className="px-4 py-2 focus:outline-none"
                        style={{
                            borderRadius: "25px",
                            border: "1px solid #EDEDED",
                            background: "#FFF",
                            height: "35px",
                            alignSelf: "stretch",
                            width: "80vw",
                            maxWidth: "500px",
                        }}
                        type="email"
                        placeholder="sample@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <p>パスワード</p>
                    <input
                        className="px-4 py-2 focus:outline-none"
                        style={{
                            borderRadius: "25px",
                            border: "1px solid #EDEDED",
                            background: "#FFF",
                            height: "35px",
                            alignSelf: "stretch",
                            width: "80vw",
                            maxWidth: "500px",
                        }}
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="text-gray-500 text-sm mb-4">パスワードを忘れた場合は<Link href="/reset-password" className="text-blue-500 underline">こちら</Link>からリセットしてください。</div>

                <div>
                    <button
                        type="submit"
                        className="px-6 py-2 mx-8 text-white font-bold hover:opacity-90 transition mx-auto block"
                        style={{
                            borderRadius: "25px",
                            background: "#FF9F1C",
                        }}
                    >
                        サインイン
                    </button>
                </div>

                <div className="text-red-500">{message}</div>
                <div>
                    アカウントをお持ちでない方は
                    <Link href="/signup" className="text-blue-500 underline">こちら</Link>
                    から登録してください。
                </div>
            </form>
        </div>
    );
}