import { AiOutlineLoading } from "react-icons/ai";

const Loading = () => {
    return (
        <div className="flex h-screen items-center justify-center">
            <AiOutlineLoading className="size-12 animate-spin" />
        </div>
    );
};

export default Loading;
