import { FaPlus, FaReply } from 'react-icons/fa';

const FooterMenu = ({ onCreateClick, onJoinClick }) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
      {/* 新規グループ制作 */}
      <div
        className="flex items-center space-x-4 mb-4 cursor-pointer"
        onClick={onCreateClick}
      >
        <FaPlus className="text-xl text-gray-600" />
        <p className="font-semibold text-gray-800">新規グループ制作</p>
      </div>

      {/* 既存のグループに加入 */}
      <div
        className="flex items-center space-x-4 cursor-pointer"
        onClick={onJoinClick}
      >
        <FaReply className="text-xl text-gray-600" />
        <p className="font-semibold text-gray-800">既存のグループに加入</p>
      </div>
    </footer>
  );
};

export default FooterMenu;