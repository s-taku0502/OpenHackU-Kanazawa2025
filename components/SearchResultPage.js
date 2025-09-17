const SearchResultPage = ({ group, onBack, onJoin, message, setMessage }) => {
    if (!group && !message) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>グループが見つかりませんでした。</p>
            </div>
        );
    }

    const handleJoinClick = () => {
        setMessage("");
        onJoin(group.id);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800">
            <div className="flex-grow flex flex-col items-center justify-center p-4 w-full max-w-sm">
                {message && (
                    <p className="text-red-500 text-center mb-4">{message}</p>
                )}

                {group && (
                    <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full mb-8">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-800">{group.name}</p>
                                <p className="text-sm text-gray-500">ID: {group.id}</p>
                            </div>
                        </div>
                    </div>
                )}

                {group && (
                    <button
                        onClick={handleJoinClick}
                        className="w-full py-3 px-6 rounded-full text-white font-bold bg-orange-500 hover:bg-orange-600 focus:outline-none"
                    >
                        加入
                    </button>
                )}
            </div>

            {/* 修正箇所: ここに戻るボタンを追加 */}
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

export default SearchResultPage;