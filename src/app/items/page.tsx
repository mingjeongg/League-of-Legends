import { fetchItems } from "@/utils/serverApi";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = async () => {
  const data = await fetchItems();

  const dataKeys = Object.keys(data);

  return (
    <div>
      <h1 className=" ml-10 text-3xl font-bold mt-10 mb-4 text-rose-700">
        아이템 목록
      </h1>
      {/* 궁금증? 29, 30번째 data가 7번째의 data인 것을 잘 인식할까?
      그렇다. 왜냐? 따로 떼놔서 헷갈릴 수 있지만 아래 dataKeys.map을 돌린건 사실 17번째 줄의 식과 같은 거고 data 기반으로 key로 이루어진 배열을 만들고
      그 배열을 map을 돌리는거니까 28, 29번째 data가 17번째의 data임을 인식하고 이 data는 7번째 data임을 인식하니까 이 코드가 가능 */}
      {/* Object.key(data).map((key) => ...}): */}
      <div className="grid grid-cols-4 gap-4 m-10">
        {dataKeys.map((key) => {
          return (
            <Link
              key={key}
              className="p-4 border rounded flex flex-col items-center justify-center "
              href={`/items/${data[key].name}`}
            >
              <Image
                src={`https://ddragon.leagueoflegends.com/cdn/14.19.1/img/item/${key}.png`}
                alt="이미지 없음"
                width={100}
                height={100}
              />
              {/* data 구조상 객체안의 championId의 객체에 접근 해야 했음
            근데 이 championId는 '동적'(고정값 X) -> data.championId 안돼, data[championId]로 해야 접근해서 가져 올 수 있음 */}
              <h2 className="mt-2 text-xl font-semibold text-rose-700">
                {data[key].name}
              </h2>
              <p className="text-gray-500">{data[key].plaintext}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default page;
