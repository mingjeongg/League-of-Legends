export type Props = {
  params: {
    itemName: string;
  };
};

import { Item } from "@/types/Item";
import { fetchItemDetail } from "@/utils/serverApi";
import Image from "next/image";
import React from "react";

export async function generateMetadata({ params }: Props) {
  return {
    title: `${params.itemName} 상세 정보`,
    description: `lol 아이템 ${params.itemName}에 대한 상세정보 입니다`,
  };
}

const ItemDetailPage = async ({ params }: Props) => {
  const data: Item = await fetchItemDetail(params.itemName);

  return (
    <div className="p-10 mx-auto max-w-3xl">
      <h1 className="text-4xl mt-10 font-bold mb-4 text-rose-700">
        {data.name}
      </h1>
      <h2 className="text-2xl text-gray-600 mb-4">{data.tags[0]}</h2>
      <Image
        className="mx-auto"
        src={`https://ddragon.leagueoflegends.com/cdn/14.19.1/img/item/${data.image.full}`}
        alt="이미지 없음"
        width={200}
        height={200}
      />
      <h3 className=" mt-8 text-rose-700 text-xl font-semibold">아이템 정보</h3>
      <p className="mt-1 text-rose-700">{data.plaintext}</p>
      <div className="mt-6 text-rose-700">
        <h3 className="text-xl font-semibold">구매 정보</h3>
        <ul className="mt-1">
          <li>• 구매 가능 여부: {data.gold.purchasable ? "가능" : "불가능"}</li>
          <li>• 가격: {data.gold.base}</li>
          <li>• 팔때: {data.gold.sell}</li>
        </ul>
      </div>
    </div>
  );
};

export default ItemDetailPage;
