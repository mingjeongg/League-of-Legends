"use server";
import { Props } from "@/app/champions/[championId]/page";
// 이렇게 server action으로 처리하면 데이터 불러오고 이런걸 브라우저에서 하는게 아니라 서버에서 하는거다보니
// 어떤 주소에서 가져오는지 이런 주소가 브라우저에서 드러날 일이 없어서 보안성에 좋음
// 그리고 원하는 데이터만 커스텀 해서 들고 올 수 있음

import { Champion, ChampionDetail, ChampionName } from "@/types/Champion";
import { ChampionDetailError } from "@/types/error";

// Server Actions를 활용하여 API Route Handlers의 사용을 최소화하며,
// 서버 컴포넌트 내에서 직접 API 데이터를 페칭하고 처리합니다.
// 이렇게 하면 뭐가 좋아? - ssg, isr 취지에 맞게 모든 로직을 서버에서 처리하고 브라우저는 정말 화면 띄우는 역할만 하게 함

export async function fetchVersion() {
  const res = await fetch(
    "https://ddragon.leagueoflegends.com/api/versions.json"
  );
  const data: number[] = await res.json();

  return data[0];
}

export async function fetchChampionList() {
  const version = await fetchVersion();
  const res = await fetch(
    `https://ddragon.leagueoflegends.com/cdn/${version}/data/ko_KR/champion.json`
  );
  const { data } = await res.json();
  // map을 사용하기위해서, 객체의 value만 뽑아내기위해 객체의 value를 배열로 바꾸는 메서드
  const chammpionsInfo: Champion[] = Object.values(data);

  // 이렇게 해도 별 효능은 없고 그냥 어떤 데이터를 가져오는지 개발자들이 확인하기는 편하긴 함
  // 걍 server action 장점 중 하나 - 데이터를 커스텀 해서 들고 올 수 있다는 것
  //   const championsInfo = dataArr.map((value) => {
  //     // map을 통해 아래의 객체로 이루어진 배열이 탄생
  //     return {
  //       name: value.name,
  //       title: value.title,
  //       key: value.key,
  //       image: {
  //         full: value.image.full,
  //         sprite: value.image.sprite,
  //         group: value.image.group,
  //         x: value.image.x,
  //         y: value.image.y,
  //         w: value.image.w,
  //         h: value.image.h,
  //       },
  //     };
  //   });

  return chammpionsInfo;
}

// 여기서 인자로 받는 {params}는 champions[championId] 페이지에서 받아온 것
export async function fetchChampionDetail({ params }: Props) {
  const version = await fetchVersion();
  const id: string = params.championId;

  // 챔피언 ID가 유효하지 않을 경우 적절한 에러 메시지와 상태 코드를 반환하게 함
  // championDetail 페이지에서 fetchChampionDetail을 호출하는데 championId가 유효하지 않으면
  // errorPayload를 받게 해서 또 뭐 어떻게 처리
  if (typeof id !== "string") {
    const errorPayload: ChampionDetailError = {
      errorMessage: "시발 챔피언 id가 유효하지 않습니다",
      statusCode: 400,
    };
    return errorPayload;
  }

  const res = await fetch(
    `https://ddragon.leagueoflegends.com/cdn/${version}/data/ko_KR/champion/${id}.json`
  );

  // 받은 res에서 data 필드만 추출
  const { data }: ChampionName = await res.json();

  return data;
}

export async function fetchItems() {
  const version = await fetchVersion();
  const res = await fetch(
    ` https://ddragon.leagueoflegends.com/cdn/${version}/data/ko_KR/item.json`
  );
  // 응답 데이터(res)에서 data 필드를 추출
  const { data } = await res.json();
}
