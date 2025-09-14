"use client";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import "../firebase";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const auth = getAuth();
    const router = useRouter();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            setMessage("登録成功: " + user.email);
            router.push("/");
        })
        .catch((error) => {
            setMessage("エラー: " + error.message);
        });
    }

    return (
        <div>
            <h1>サインアップ</h1>
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
                <button type="submit">サインアップ</button>
                <div>{message}</div>
            </form>
        </div>
    );
}