"use client";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "../firebase";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
            setMessage("サインイン成功: " + user.email);
            router.push("/");
        })
        .catch((error) => {
            setMessage("エラー: " + error.message);
        });
    }

    return (
        <div>
            <h1>サインイン</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="メールアドレス"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="パスワード"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">サインイン</button>
                <div>{message}</div>
                <a href="/signup">サインアップ</a>
            </form>
        </div>
    );
}