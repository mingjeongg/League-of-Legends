// > Server Actions 사용 시 유의사항:
// >
// > - **Server Components,** **Client Components** 에서 모두 사용할 수 있습니다.
// > - Server action 은 비동기 함수여야 합니다. 반환 타입이 `Promise<T>` 형태임을 유의하세요.
// > - 데이터 페칭 로직을 컴포넌트 내부에 직접 포함시켜 코드의 간결성을 유지합니다.
// > - 각 함수의 반환 타입을 정확하게 명시하여 타입 안전성을 확보하세요.
// > - 함수의 매개변수에도 타입을 지정하여 입력값의 타입을 체크하세요.

import { Champion } from "@/types/Champion";
import { fetchChampionList, fetchVersion } from "@/utils/serverApi";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ChampionListPage = async () => {
  const data = await fetchChampionList();
  const version = await fetchVersion();
  return (
    <div>
      <h1>챔피언 로테이션</h1>
      {data.map((champion) => {
        return (
          <Link key={champion.name} href={`/champions/${champion.name}`}>
            <Image
              // image는 롤에 있음 하면 lol doc가서 이미지 주소 가져와야함.
              src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champion.name}.png`}
              alt="이미지 없음"
              width={champion.image.w}
              height={champion.image.h}
            />
            <h2>{champion.name}</h2>
            <p>{champion.title}</p>
          </Link>
        );
      })}
    </div>
  );
};

export default ChampionListPage;
