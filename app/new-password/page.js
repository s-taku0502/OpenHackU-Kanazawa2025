"use client";
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import Link from "next/link";

// Firebase設定を環境変数から取得
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
};

const App = () => {
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [oobCode, setOobCode] = useState(null);
  const [continueUrl, setContinueUrl] = useState('/');
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    if (!firebaseConfig.apiKey) {
      setMessage('エラー: Firebase APIキーが設定されていません。');
      setLoading(false);
      return;
    }

    const app = initializeApp(firebaseConfig);
    const authInstance = getAuth(app);
    setAuth(authInstance);

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('oobCode');
    const url = urlParams.get('continueUrl') || '/';

    setOobCode(code);
    setContinueUrl(url);

    const verifyCode = async () => {
      if (!code) {
        setMessage('エラー: 無効なリンクです。再度お試しください。');
        setLoading(false);
        return;
      }
      try {
        await verifyPasswordResetCode(authInstance, code);
        setIsCodeValid(true);
      } catch (error) {
        console.error(error);
        setIsCodeValid(false);
        setMessage('パスワードの再設定のリクエストの期限が切れたか、リンクがすでに使用されています。');
      } finally {
        setLoading(false);
      }
    };

    verifyCode();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      if (!oobCode || !auth) {
        setMessage('エラー: 無効なリンクまたは設定エラーです。');
        return;
      }
      await confirmPasswordReset(auth, oobCode, password);
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      setMessage(`エラー: ${error.message}`);
    }
  };

  const handleContinue = () => {
    if (continueUrl) {
      window.location.href = continueUrl;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-xl font-bold bg-orange-50">
        <div className="flex items-center space-x-2">
          <svg className="animate-spin h-5 w-5 text-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>読み込み中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans p-4">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-md">
        {isSuccess ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">パスワードを変更しました</h2>
            <p className="mb-4">新しいパスワードでログインできるようになりました</p>
            <button
              onClick={handleContinue}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              続行
            </button>
          </div>
        ) : !isCodeValid ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">パスワードの再設定をもう一度お試しください</h2>
            <p className="text-sm md:text-base">{message}</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">パスワードの再設定</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                  新しいパスワード
                </label>
                <input
                  type="password"
                  id="new-password"
                  name="new-password"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="新しいパスワード"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full p-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-900"
              >
                パスワードを変更
              </button>
            </form>
            {message && (
              <div className={`text-center mt-4 ${message.startsWith('エラー') ? 'text-red-500' : 'text-green-600'}`}>
                {message}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;