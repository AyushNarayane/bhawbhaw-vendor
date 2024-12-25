import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import { ModelProvider } from "@/hooks/model-context";
import { ModelProviderPages } from "@/components/sellerPage/providers/model-provider";

export const metadata = {
  title: "Bhaw Bhaw | Simplify Your Business Management",
  description: "Connecting Pet Sellers with Pet Lovers Everywhere",
};

export default function RootLayout({ children }) {
  return (
    <div className="flex flex-col w-full h-screen">
      <ModelProvider>
        <ModelProviderPages/>
        <div className="min-h-[4.5rem]">
          <Header />
        </div>
        <div className="flex flex-row flex-grow w-full h-full">
          <div className="custom_shadow mt-2 w-[15rem]">
            <Sidebar />
          </div>
          <div className="flex-grow bg-oohpoint-grey-100 p-5">{children}</div>
        </div>
      </ModelProvider>
    </div>
  );
}
