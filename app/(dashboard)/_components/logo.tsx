import Image from "next/image";
import Link from "next/link";

const Logo = () => {
    return (
        <Link href="/">
          {/* Project's logo */}
          <Image
            src="/learnify-logo.svg"
            alt="Logo"
            width={110}
            height={110}
          />
        </Link>
    );
}
 
export default Logo;