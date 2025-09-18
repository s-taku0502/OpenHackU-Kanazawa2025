"use client"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Linden_Hill } from "next/font/google";
import Link from "next/link";

export default function Home() {
  const auth = getAuth();
  const router = useRouter();
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [uid, setUid] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setEmail(user.email);
        setUid(user.uid);
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setName(userDocSnap.data().name);
        }
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      console.error("サインアウトエラー:", error);
      alert(`サインアウトに失敗しました: ${error.message}`);
    });
  }

  return (
    <div>
      <div>
        <h1>ホーム(仮)</h1>
        <p>名前：{name}</p>
        <p>メールアドレス：{email}</p>
        <p>UID：{uid}</p>
        <button onClick={handleSignOut}>サインアウト</button>
      </div>
      <Link href="/setting">設定ページへ</Link>
    </div>
  );
}