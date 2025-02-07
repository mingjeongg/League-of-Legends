// 클라이언트 사이드에서 실시간으로 데이터를 가져와야 하는 경우에만 Route Handlers 를 활용해 봅시다
// 왜? - 서버사이드에서는 그냥 fetch해오면 되는데, 클라이언트사이드에서는 useEffect하고 뭐 자잘히 할 거 많다
// 그래서 클라이언트사이드에서 라우트 핸들러 사용한다

import { ChampionRotation } from "@/types/ChampionRotation";
import { fetchChampionList } from "@/utils/serverApi";
import { NextResponse } from "next/server";

// (request: Reauest) 적으면 eslint no-unused-vars 라는 오류가 난다. 즉 사용안하는 변수가 있다고 warning으로 잡아준다
//
export async function GET() {
  // 1. 환경변수에서 API 키 가져오기
  const KEY = process.env.RIOT_API_KEY;

  // 2. Riot Games API 호출 (요청 헤더에 X-Riot-Token을 설정하여 API 키 포함시켜)
  const res = await fetch(
    "https://kr.api.riotgames.com/lol/platform/v3/champion-rotations",
    {
      headers: {
        // env파일에 있는 것들은 runtime때에만 확인 가능, 근데 typeScript는 런타임 전에 읽는다
        // 그래서 typeScript가 env 파일에 어떤값이 있는지, 값이 있긴 한건지는 모르니까 env 파일 안에 있는 것을 type을 string | undefined로 추론
        // 하지만 header는 KEY(env파일안에있는것)가 undefined는 용납 못해
        // headers는 X-Riot-Token이 string이여야만 한다고 생각해서 key값이 없을때는 빈문자열로 type 지정하면 오류 안남
        "X-Riot-Token": KEY || "",
      },
      cache: "no-store",
    }
  );

  // json 하기 전 즉 말그대로 res에 ok라는 객체 있다. json(res)에는 없다
  // !!!!!!!!!!!!!!!!!! error가 났을땐 아래 객체를 반환하는거고 이도 route handler로 만든 함수가 return하는 값이고
  // data 대신 이 객체를 return 하는거라 data return 하는 것 처럼 통신 언어로 내뱉어줘야해서 NextResponse.json()이 필요
  if (!res.ok) {
    return NextResponse.json({
      message: "챔피언 로테이션 목록을 불러오는데 실패하였습니다",
      status: res.status,
    });
  }
  // -------- error처리 하는데 좀 더 쉬운 방법
  // 아래처럼 적으면 error를 가까운 error.tsx로 던져줌 그리고 error.tsx에서 erroor 처리함
  // if (!res.ok) {
  //   throw new Error("챔피언 로테이션 목록을 불러오는데 실패하였습니다");
  // }

  // res.json 하면 {freeChampions:[], forNewPlayers:[]}가 있는데 난 freeCham만 필요해서 구조분해할당 활용하여 딱 필요한 데이터만 return 하게 처리
  const { freeChampionIds }: ChampionRotation = await res.json();

  const championLisData = await fetchChampionList();
  const data = championLisData.filter((champion) => {
    return freeChampionIds.includes(Number(champion.key));
  });
  // freeChampionIds는 champion key로 이루어진 숫자 배열
  // 이 champion key를 가진 캐릭터들을 championListData에서 뽑아내야함
  //   각 챔피언 객체에서 key를 가져와 숫자로 변환합니다(Number(champion.key)).
  // 이 변환된 key가 freeChampionIds 배열에 포함되어 있는지를 확인합니다.
  // includes 메소드는 주어진 값이 배열에 존재하면 true를, 아니면 false를 반환합니다.
  // 결과적으로, key가 freeChampionIds에 포함된 챔피언들만 새로운 배열에 남게 됩니다.
  // ===> 즉 filter 메소드는 배열을 하나하나 돌며 champion을 하나씩 넣고 return 뒤에 식이 true면 그 champion을 뱉는 것

  // 서버에서 주는 응답이니까 다시 서버와 클라이언트가 통신하는 형식 string형식으로 바꿔줘야지
  return NextResponse.json(data);
  // Response.json(data)로 써도 되는데 next.js로부터 import 해와서 쓰는 NextResponse는 next.js에  좀 더 최적화 돼있다
}

//-------------------------------------------------------------------------------
// 그리고 어떤 데이터를 return 하는지 확인하기 위해 thunder clinet 활용
// 하지만 지금 env 파일에 있는 Riot~~ 는 next.js문법이고 thunderclient는 이걸 못읽음
// 그래서 thunder clinet에서 요청 할 때 headers 탭에서 X-Riot-Token이랑 API Key를 손수 넣어줘야함
