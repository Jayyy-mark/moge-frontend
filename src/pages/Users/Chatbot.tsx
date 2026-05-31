import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ChatCard from "../../components/form/ChatCard";

export default function Chatbot() {
    return (
        <div>
            <PageMeta
                title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
                description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <PageBreadCrumb pageTitle="Chatbot" />
            <div className="flex justify-center items-center w-full">
                <div className="w-full max-w-7xl">
                    <ChatCard />
                </div>
            </div>
        </div>
    );
}
