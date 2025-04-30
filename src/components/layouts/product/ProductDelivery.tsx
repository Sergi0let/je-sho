import { FC } from "react";

interface IDeliveryData {
  id: number;
  name: string;
  type: string;
  term: string;
  cost: string;
}

const deliveryData: IDeliveryData[] = [
  {
    id: 1,
    name: "Нова Пошта",
    type: "Самовивіз або кур'єром",
    term: "1-5 днів",
    cost: "За тарифами перевізника",
  },
  {
    id: 2,
    name: "Укрпошта",
    type: "З пунктів видачі",
    term: "2-7 днів",
    cost: "За тарифами перевізника",
  },
];

interface IconProps {
  className?: string;
}

export const Novaposhtaicon: FC<IconProps> = ({ className = "" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 755 755.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M443.9 612.8v-157H310.7v157H208.9l123.4 123.7c24.8 24.8 65 24.8 89.9 0l123.7-123.7h-102zm-301.6-66.6V208.9L18.6 332.4c-24.8 24.8-24.8 65 0 89.9l123.7 123.9zm168.4-404.1v157h133.2v-157h102L422.2 18.6c-24.8-24.8-65-24.8-89.9 0L208.9 142.1h101.8zM736 332.4L612.5 208.9v337l123.7-123.7c24.8-24.6 25.1-64.8.8-89.6l-.3-.3h-.7z"
        fill="#da291c"
      />
    </svg>
  );
};

export const Ukrposhtaicon: FC<IconProps> = ({ className = "" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 580.1 844.4"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M411.1 703.6c-51.6 73.6-97 138.3-97 138.3-1.1 1.5-2.8 2.4-4.7 2.4-1.9 0-3.6-.9-4.7-2.4l-96.9-138.3h203.3z"
        fill="#FABC26"
      />
      <path
        d="M509.8 562.9c-28.2 40.2-64.8 92.4-98.7 140.7H207.8l-98.5-140.7h400.5z"
        fill="#FABC26"
      />
      <path
        d="M517.4 436.6s-32.1-7.2-63.6-14.4h79.7c-2.6 3.9-5.4 7.7-8.2 11.5-1.9 2.4-4.9 3.5-7.9 2.9zm37.5 48.1s-245-55.5-276.3-62.5H21.3c8.8 22.3 20.3 44 34.7 64.6l53.3 76.2h400.5c28.6-40.8 48.6-69.3 48.6-69.3.6-.9 1-2 1-3.2 0-2.9-2-5.2-4.5-5.8z"
        fill="#FABC26"
      />
      <path
        d="M579.9 281.5c-2.1 52-19 100.3-46.4 140.7h-79.7c-30.6-6.9-60.8-13.7-60.8-13.8-1.7-.4-3-1.9-3-3.8 0-1.3.6-2.5 1.6-3.2l.1-.1c33.6-21.1 59-55 68.5-96.7 1.8-7.8 2.9-15.5 3.5-23.2h116.2zm-304.6 140c-68.2-15.4-115.6-73.7-120.2-140H1.3c-4.3 47.1 2.2 95.3 20 140.7h257.3c-2.2-.5-3.3-.7-3.3-.7z"
        fill="#FABC26"
      />
      <path
        d="M580.1 270.6c0 3.6-.1 7.2-.2 10.9H463.8c4.1-56.8-23.6-110.6-70.2-140.7H547c21.1 38.5 33.1 82.7 33.1 129.8zM49.9 140.7c-27.6 42.6-44.1 91-48.6 140.7h153.8c-1-14.7 0-29.9 3.5-45 9.3-41 34.1-74.5 66.8-95.7H49.9z"
        fill="#FABC26"
      />
      <path
        d="M547 140.7H393.6c-14.9-9.7-31.7-16.9-50-21-42.3-9.6-84.5-.8-118.2 21H49.9c21-32.4 48.5-61.4 82.1-84.9C184.5 19.1 244.5 1 304.1 0h9.9c2.6 0 10.3.3 11.6.4C421.2 6 503.4 61.3 547 140.7z"
        fill="#FABC26"
      />
    </svg>
  );
};

const deliveryIcons: Record<string, FC<IconProps>> = {
  "Нова Пошта": Novaposhtaicon,
  Укрпошта: Ukrposhtaicon,
};


const ProductDelivery = () => {
  return (
    <table className="w-full">
      <thead>
        <tr className="text-gray-main border-stroke-main border-b text-[10px] uppercase md:text-xs">
          <th className="px-2 pb-2 md:pb-3" align="left">
            Спосіб доставки
          </th>
          <th className="w-1/4 px-2 pb-2 md:pb-3" align="center">
            Термін
          </th>
          <th className="px-2 pb-2 md:pb-3" align="left">
            Вартість
          </th>
        </tr>
      </thead>
      <tbody>
        {deliveryData.map(({ id, name, type, term, cost }: IDeliveryData) => {
          const IconComponent = deliveryIcons[name] || null;

          return (
            <tr key={id}>
              <td className="px-2 py-3 text-xs md:py-4 md:text-base">
                <div className="flex items-center">
                  {IconComponent && (
                    <IconComponent className="mr-2 size-6 md:mr-3 md:size-10" />
                  )}
                  <div className="">
                    <div className="text-xs font-medium md:text-base">
                      {name}
                    </div>
                    <div className="text-gray-main line-clamp-1 text-xs md:text-sm">
                      {type}
                    </div>
                  </div>
                </div>
              </td>
              <td
                align="center"
                className="px-2 py-3 text-xs md:py-4 md:text-base"
              >
                {term}
              </td>
              <td className="px-2 py-3 text-xs md:py-4 md:text-base">
                <p className="line-clamp-2">{cost}</p>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ProductDelivery;
