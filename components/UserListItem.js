const UserListItem = ({ name, id }) => {
    return (
        <div className="flex items-center space-x-4 p-3 hover:bg-gray-100 cursor-pointer">
            {/* ユーザーのアイコン */}
            <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>

            {/* ユーザー名とID */}
            <div className="flex-1">
                <p className="font-semibold text-gray-800">{name}</p>
                <p className="text-sm text-gray-500">ID: {id}</p>
            </div>
        </div>
    );
};

export default UserListItem;