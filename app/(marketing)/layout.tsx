import Footer from "@/components/global/footer";
import Navbar from "@/components/global/navbar";

interface MarketingLayout {
    children: React.ReactNode;
}

const MarketingLayout = ({ children }: MarketingLayout) => {
    return (
        <div
          className="h-full"
        >
            <Navbar />
            <main
              className="pt-40"
            >
              {children}
            </main>
            <Footer />
        </div>
    );
}
 
export default MarketingLayout;