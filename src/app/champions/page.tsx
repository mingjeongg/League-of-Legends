// > Server Actions 사용 시 유의사항:
// >
// > - **Server Components,** **Client Components** 에서 모두 사용할 수 있습니다.
// > - Server action 은 비동기 함수여야 합니다. 반환 타입이 `Promise<T>` 형태임을 유의하세요.
// > - 데이터 페칭 로직을 컴포넌트 내부에 직접 포함시켜 코드의 간결성을 유지합니다.
// > - 각 함수의 반환 타입을 정확하게 명시하여 타입 안전성을 확보하세요.
// > - 함수의 매개변수에도 타입을 지정하여 입력값의 타입을 체크하세요.

import { fetchChampionList, fetchVersion } from "@/utils/serverApi";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ChampionListPage = async () => {
  const version = await fetchVersion();
  const data = await fetchChampionList();

  return (
    <div>
      <h1 className=" ml-10 text-3xl font-bold mt-10 mb-4 text-rose-700">
        챔피언 목록
      </h1>
      <div className="grid grid-cols-4 gap-4 m-10">
        {data.map((champion) => {
          return (
            <Link
              className="p-4 border rounded flex flex-col items-center justify-center "
              key={champion.name}
              href={`/champions/${champion.id}`}
            >
              <Image
                // image는 롤에 있음 하면 lol doc가서 이미지 주소 가져와야함.
                // lol측이 이미지 가져가고 싶으면 id의 value를 사용하라했는데 난 값이 똑같단 이유로 name의 value를 사용해서 문제 생겼었음
                src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champion.id}.png`}
                alt="이미지 없음"
                width={100}
                height={100}
              />
              <h2 className="mt-2 text-xl font-semibold text-rose-700">
                {champion.name}
              </h2>
              <p className="text-gray-500">{champion.title}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ChampionListPage;
