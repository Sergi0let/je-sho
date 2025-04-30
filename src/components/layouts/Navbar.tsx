import { cn } from "@/lib/utils";
import Image from "next/image";
import Clockicon from "../icons/Clockicon";
import Deliveryicon from "../icons/Deliveryicon";
import Logosmallicon from "../icons/Logosmallicon";
import Returnicon from "../icons/Returnicon";

interface Props {
  className?: string;
}

const Navbar = ({ className = "" }: Props) => {
  return (
    <header className={cn("bg-blue-main", className)}>
      <div className="mx-auto flex h-[56px] max-w-[1360px] items-center justify-between px-4 lg:h-[72px]">
        <div>
          <Image
            className="h-[32px] w-[92px] lg:h-[40px] lg:w-[114px]"
            src="/assets/img/logo.webp"
            width={114}
            height={40}
            alt="лого є що"
          />
        </div>
        <ul className="hidden max-w-1/2 flex-1 items-center justify-between space-x-2 lg:flex">
          <li className="flex items-center">
            <Deliveryicon className="mr-2 w-4" />
            <span className="text-sm text-white">Доставка від 69 грн</span>
          </li>
          <li className="flex items-center">
            <Returnicon className="mr-2 w-4" />
            <span className="text-sm text-white">14 днів на повернення</span>
          </li>
          <li className="flex items-center">
            <Clockicon className="mr-2 w-4" />
            <span className="text-sm text-white">
              У вас за 2-7 робочих днів
            </span>
          </li>
        </ul>
        <div className="flex">
          <Logosmallicon className="mr-2 w-5" />
          <span className="text-sm font-medium text-white md:text-base">
            У нас завжди є що купити!
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
