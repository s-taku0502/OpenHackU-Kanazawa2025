import { FaCamera } from 'react-icons/fa';
import { useState } from 'react';

const CreateGroupPage = ({ onBack, onCreateGroup, message, setMessage }) => {
    const [groupName, setGroupName] = useState("");

    const handleCreateClick = (e) => {
        e.preventDefault();
        setMessage("");
        onCreateGroup(groupName);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800">
            <header className="fixed top-0 w-full flex justify-between items-center p-4 border-b border-gray-200">
                <p className="font-semibold text-xl">グループ制作</p>
            </header>

            <div className="flex-grow flex flex-col items-center justify-center p-4 w-full max-w-sm">
                {/* アイコン */}
                <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center mb-8">
                    <FaCamera className="text-4xl text-gray-500" />
                </div>

                {/* グループ名入力 */}
                <form onSubmit={handleCreateClick} className="w-full text-center mb-4">
                    <p className="text-sm text-gray-600 mb-2">グループ名</p>
                    <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="ノビシロ"
                        className="w-full text-center p-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                    />

                    {/* メッセージ表示エリア */}
                    {message && (
                        <p className="text-red-500 text-center mt-4">{message}</p>
                    )}

                    {/* 制作ボタン */}
                    <button
                        type="submit"
                        className="w-full py-3 px-6 mt-8 rounded-full text-white font-bold bg-orange-500 hover:bg-orange-600 focus:outline-none"
                    >
                        作成
                    </button>
                </form>
            </div>

            <div className="w-full max-w-sm p-4">
                <button
                    onClick={onBack}
                    className="w-full py-3 px-6 rounded-full text-white font-bold bg-gray-500 hover:bg-gray-600 focus:outline-none"
                >
                    戻る
                </button>
            </div>
        </div>
    );
};

export default CreateGroupPage;