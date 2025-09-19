import React from 'react';

const UserList = ({ users, appliedGroupId, onApplyGroup }) => {
  return (
    <div className="max-h-[calc(100vh-160px)] overflow-y-auto rounded-lg shadow-md bg-gray-100 p-4"> 
      <h2 className="text-xl text-center font-bold mb-4 text-gray-800">参加中のグループ</h2>
      {users.length === 0 ? (
        <p className="text-gray-600">まだ参加しているグループはありません。</p>
      ) : (
        <ul>
          {users.map((group) => (
            <li 
              key={group.id} 
              className={`mb-4 p-4 rounded-lg shadow flex items-center space-x-4 cursor-pointer transition-all duration-200 
                ${group.id === appliedGroupId ? 'bg-orange-100 border-2 border-orange-500' : 'bg-white'}`}
              onClick={() => onApplyGroup(group.id)}
            >
              <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
              <div>
                <div className="flex items-center space-x-2">
                  <p className="font-semibold text-gray-800">{group.name}</p>
                  {group.id === appliedGroupId && (
                    <span className="text-xs text-orange-500 font-bold">選択中</span>
                  )}
                </div>
                <p className="text-sm text-gray-500">ID: {group.id}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;