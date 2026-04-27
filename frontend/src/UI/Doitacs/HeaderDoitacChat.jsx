import { useNavigate } from "react-router-dom";

const HeaderDoitacChat = ({ user }) => {
    const navigate = useNavigate();

    return (
        <div className="w-full h-16 px-6 flex items-center justify-between 
                    bg-[#0f172a]/80 backdrop-blur-md border-b border-green-800/30 shadow-sm">

            {/* LEFT */}
            <div className="flex items-center gap-4">

                {/* 🔙 NÚT QUAY VỀ */}
                <button
                    onClick={() => navigate(`/doitac/${user?.id}/loimoinhom`)}
                    className="text-green-400 hover:text-white transition text-xl"
                >
                    ←
                </button>

                {/* Badge HDV */}
                <div className="px-3 py-1 rounded-full bg-green-600/20 text-green-400 text-xs font-medium border border-green-500/30">
                    Hướng dẫn viên
                </div>

                {/* Name */}
                <h2 className="text-white font-semibold text-base tracking-wide">
                    {user?.hoTen}
                </h2>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4">

                {/* Status */}
                <div className="flex items-center gap-2 text-green-400 text-sm">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    Đang hoạt động
                </div>

                {/* Avatar */}
                <div className="w-9 h-9 rounded-full overflow-hidden border border-green-500/40">
                    <img
                        src={
                            user?.image
                                ? `http://localhost:5000/${user.image}`
                                : "/img/default.jpg"
                        }
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default HeaderDoitacChat;