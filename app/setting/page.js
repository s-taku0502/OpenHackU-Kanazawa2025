"use client";
import { getAuth, onAuthStateChanged, updateEmail, updatePassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Setting() {
    const auth = getAuth();
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [iconUrl, setIconUrl] = useState("");
    const [iconFile, setIconFile] = useState(null);
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [emailMsg, setEmailMsg] = useState("");
    const [pwMsg, setPwMsg] = useState("");
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [showPwForm, setShowPwForm] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
            if (!firebaseUser) {
                router.push("/login");
            }
        });
        return () => unsubscribe();
    }, [auth, router]);

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
                setEmail(user.email);
            }
        };
        fetchProfile();
    }, [user]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">認証確認中...</div>;
    }
    if (!user) {
        return null; // ログイン画面へリダイレクト中
    }

    const isFormFilled = name && bio;

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
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormFilled) {
            setMessage("全ての項目を入力してください");
            return;
        }
        await setDoc(doc(db, "users", user.uid), {
            name,
            bio,
            personal_image: iconUrl,
        }, { merge: true });
        setMessage("プロフィールを保存しました");
    };

    // メールアドレス変更
    const handleEmailChange = async (e) => {
        e.preventDefault();
        setEmailMsg("");
        if (!user) return;
        try {
            await updateEmail(user, email);
            setEmailMsg("メールアドレスを変更しました");
        } catch (err) {
            setEmailMsg("メールアドレス変更エラー: " + err.message);
        }
    };

    // パスワード変更
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPwMsg("");
        if (!user) return;
        try {
            await updatePassword(user, newPassword);
            setPwMsg("パスワードを変更しました");
        } catch (err) {
            setPwMsg("パスワード変更エラー: " + err.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: "#FFF7EE" }}>
            <button
                type="button"
                className="self-start ml-4 mt-4 px-4 py-2 rounded-full bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition"
                onClick={() => router.push("/")}
                style={{ position: "absolute", top: 16, left: 16 }}
            >
                ← 戻る
            </button>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 p-8 rounded-lg bg-transparent items-center justify-center"
                style={{ inlineSize: "100%", maxInlineSize: 500 }}
            >
                <h1 className="text-2xl font-bold text-center text-black mb-2">プロフィール設定</h1>
                <div className="w-full flex flex-col items-center mb-2">
                    {iconUrl && (
                        <img src={iconUrl} alt="icon" className="rounded-full mb-2" style={{ width: 80, height: 80, objectFit: "cover" }} />
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleIconChange}
                        className="mb-2"
                    />
                </div>
                <div className="w-full">
                    <p>名前</p>
                    <input
                        className="px-4 py-2 focus:outline-none w-full"
                        style={{
                            borderRadius: "25px",
                            border: "1px solid #EDEDED",
                            background: "#FFF",
                            blockSize: "35px",
                        }}
                        type="text"
                        placeholder="名前"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="w-full">
                    <p>自己紹介</p>
                    <textarea
                        className="px-4 py-2 focus:outline-none w-full"
                        style={{
                            borderRadius: "25px",
                            border: "1px solid #EDEDED",
                            background: "#FFF",
                            minBlockSize: "100px",
                        }}
                        placeholder="自己紹介を入力してください"
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        required
                    />
                </div>
                <div className="w-full">
                    <button
                        type="submit"
                        className={`px-6 py-2 text-white font-bold transition mx-auto block w-full ${!isFormFilled ? 'grayscale opacity-60 cursor-not-allowed' : 'hover:opacity-90'}`}
                        style={{
                            borderRadius: "25px",
                            background: "#FF9F1C",
                        }}
                        disabled={!isFormFilled}
                    >
                        保存
                    </button>
                </div>
                {message && <div className="text-red-500">{message}</div>}
            </form>

            {/* メールアドレス変更トグル */}
            <button
                type="button"
                className="flex items-center gap-2 text-gray-500 font-medium mt-4"
                onClick={() => setShowEmailForm(v => !v)}
            >
                <span className={`transition-transform ${showEmailForm ? 'rotate-90' : ''}`}>{'>'}</span>
                <span>メールアドレス変更はこちら</span>
            </button>
            {showEmailForm && (
                <form onSubmit={handleEmailChange} className="flex flex-col gap-2 mt-2 p-4 rounded-lg bg-white shadow w-full max-w-md">
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
                <form onSubmit={handlePasswordChange} className="flex flex-col gap-2 mt-2 p-4 rounded-lg bg-white shadow w-full max-w-md">
                    <label>パスワード変更</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input
                            className="px-4 py-2 focus:outline-none border rounded w-full pr-10"
                            style={{
                                borderRadius: "25px",
                                border: "1px solid #EDEDED",
                                background: "#FFF",
                                blockSize: "35px",
                            }}
                            type={showPassword ? "text" : "password"}
                            placeholder="新しいパスワード"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            style={{
                                position: 'absolute',
                                right: 12,
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
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">パスワード変更</button>
                    <div className="text-green-600">{pwMsg}</div>
                </form>
            )}
        </div>
    );
}