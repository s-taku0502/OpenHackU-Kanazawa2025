"use client";
import { getAuth, updateEmail, updatePassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Link from "next/link";

export default function Setting() {
    const auth = getAuth();
    const user = auth.currentUser;
    const router = useRouter();

    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [iconUrl, setIconUrl] = useState("");
    const [iconFile, setIconFile] = useState(null);
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState(user?.email || "");
    const [newPassword, setNewPassword] = useState("");
    const [emailMsg, setEmailMsg] = useState("");
    const [pwMsg, setPwMsg] = useState("");
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [showPwForm, setShowPwForm] = useState(false);

    // Firestoreからプロフィール情報を取得
    useEffect(() => {
        if (!user) return;
        const fetchProfile = async () => {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setName(data.name || "");
                setBio(data.bio || "");
                setIconUrl(data.personal_image || "");
            }
        };
        fetchProfile();
    }, [user]);

    // アイコン画像アップロード
    const handleIconChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !user) return;
        setIconFile(file);
        const storageRef = ref(storage, `user_icons/${user.uid}/${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        setIconUrl(url);
        setMessage("アイコン画像をアップロードしました");
    };

    // プロフィール保存
    const handleSave = async (e) => {
        e.preventDefault();
        if (!user) return;
        await setDoc(doc(db, "users", user.uid), {
            name,
            bio,
            personal_image: iconUrl,
        }, { merge: true });
        setMessage("プロフィールを保存しました");
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Link href="/login">ログインしてください</Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: "#FFF7EE" }}>
            <h1 className="text-3xl font-bold mb-8">プロフィール設定</h1>
            <form onSubmit={handleSave} className="flex flex-col gap-4 p-8 rounded-lg bg-transparent items-center justify-center">
                <div className="flex flex-col items-center">
                    <label className="mb-2">アイコン画像</label>
                    <div className="w-20 h-20 relative rounded-full overflow-hidden bg-gray-200 mb-2">
                        <Image
                            src={iconUrl || "/file.svg"}
                            alt="アイコン画像"
                            fill
                            style={{ objectFit: "cover" }}
                            className="rounded-full"
                            sizes="80px"
                        />
                    </div>
                    <input type="file" accept="image/*" onChange={handleIconChange} />
                </div>
                <div>
                    <label>ユーザー名</label>
                    <input
                        className="px-4 py-2 focus:outline-none"
                        style={{
                            borderRadius: "25px",
                            border: "1px solid #EDEDED",
                            background: "#FFF",
                            height: "35px",
                            width: "80vw",
                            maxWidth: "500px",
                        }}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>自己紹介</label>
                    <textarea
                        className="px-4 py-2 focus:outline-none"
                        style={{
                            borderRadius: "15px",
                            border: "1px solid #EDEDED",
                            background: "#FFF",
                            width: "80vw",
                            maxWidth: "500px",
                            minHeight: "60px",
                        }}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="px-6 py-2 mx-8 text-white font-bold hover:opacity-90 transition mx-auto block"
                    style={{
                        borderRadius: "25px",
                        background: "#FF9F1C",
                    }}
                >
                    保存
                </button>
                <div className="text-green-600">{message}</div>
            </form>

            {/* メールアドレス変更トグル */}
            <button
                type="button"
                className="flex items-center gap-2 text-gray-500 font-medium"
                onClick={() => setShowEmailForm(v => !v)}
            >
                <span className={`transition-transform ${showEmailForm ? 'rotate-90' : ''}`}>{'>'}</span>
                <span>メールアドレス変更はこちら</span>
            </button>
            {showEmailForm && (
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    setEmailMsg("");
                    if (!user) return;
                    try {
                        await updateEmail(user, email);
                        setEmailMsg("メールアドレスを変更しました");
                    } catch (err) {
                        setEmailMsg("メールアドレス変更エラー: " + err.message);
                    }
                }} className="flex flex-col gap-2 mt-2 p-4 rounded-lg bg-white shadow w-full max-w-md">
                    <label>メールアドレス変更</label>
                    <input
                        className="px-4 py-2 focus:outline-none border rounded"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">メールアドレス変更</button>
                    <div className="text-green-600">{emailMsg}</div>
                </form>
            )}

            {/* パスワード変更トグル */}
            <button
                type="button"
                className="mt-4 flex items-center gap-2 text-gray-500 font-medium"
                onClick={() => setShowPwForm(v => !v)}
            >
                <span className={`transition-transform ${showPwForm ? 'rotate-90' : ''}`}>{'>'}</span>
                <span>パスワード変更はこちら</span>
            </button>
            {showPwForm && (
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    setPwMsg("");
                    if (!user) return;
                    try {
                        await updatePassword(user, newPassword);
                        setPwMsg("パスワードを変更しました");
                    } catch (err) {
                        setPwMsg("パスワード変更エラー: " + err.message);
                    }
                }} className="flex flex-col gap-2 mt-2 p-4 rounded-lg bg-white shadow w-full max-w-md">
                    <label>パスワード変更</label>
                    <input
                        className="px-4 py-2 focus:outline-none border rounded"
                        type="password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">パスワード変更</button>
                    <div className="text-green-600">{pwMsg}</div>
                </form>
            )}
        </div>
    );
}