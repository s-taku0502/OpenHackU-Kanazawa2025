"use client"
import { getAuth, onAuthStateChanged, signOut} from "firebase/auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./firebase";

export default function Home() {
  const auth = getAuth();
  const router = useRouter();
  const [email, setEmail] = useState(null);
  const [uid, setUid] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email);
        setUid(user.uid);
      } else {
        router.push("/signin");
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
      <h1>ホーム(仮)</h1>
      <p>メールアドレス：{email}</p>
      <p>UID：{uid}</p>
      <button onClick={handleSignOut}>サインアウト</button>
    </div>
  );
}