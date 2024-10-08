"use server";

// 이렇게 server action으로 처리하면 데이터 불러오고 이런걸 브라우저에서 하는게 아니라 서버에서 하는거다보니
// 어떤 주소에서 가져오는지 이런 주소가 브라우저에서 드러날 일이 없어서 보안성에 좋음
// 그리고 원하는 데이터만 커스텀 해서 들고 올 수 있음

import { Champion } from "@/types/Champion";
import { Item } from "@/types/Item";

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

//champion 목록 데이터는 자주 변경 되는게 아니라서 isr을 통해서 성능 최적화시킴
export async function fetchChampionList() {
  const version = await fetchVersion();
  const res = await fetch(
    `https://ddragon.leagueoflegends.com/cdn/${version}/data/ko_KR/champion.json`,
    {
      next: { revalidate: 864000 },
    }
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
export async function fetchChampionDetail(championId: string) {
  const version = await fetchVersion();

  const res = await fetch(
    `https://ddragon.leagueoflegends.com/cdn/${version}/data/ko_KR/champion/${championId}.json`
  );

  // 받은 res에서 data 필드만 추출
  const { data } = await res.json();

  // console.log(res) 찍고 ok 라는 key 존재하는지 부터 확인 -> 있으면 아래처럼 써서 오류 처리 해줄 수 있다
  // 여기서 res는 즉 json화 하기 전
  if (!res.ok) {
    return {
      message: "Please enter a valid Champion Name",
      status: res.status,
    };
  }

  // data 구조상 객체안의 championId의 객체에 접근 해야 했음
  // 근데 이 championId는 '동적'(고정값 X) -> data.championId 안돼, data[championId]로 해야 접근해서 가져 올 수 있음
  return data[championId];
}

export async function fetchItems() {
  const version = await fetchVersion();
  const res = await fetch(
    `https://ddragon.leagueoflegends.com/cdn/${version}/data/ko_KR/item.json`
  );
  // 응답 데이터(res)에서 data 필드를 추출
  const { data } = await res.json();

  return data;
}

export async function fetchItemDetail(itemName: string) {
  // 인자로 props.params.itemName을 받을때 encoding 돼서 넘어옴
  // 즉 이상하게 넘어왔음 (%23C 막 이런식으로) 하여 디코딩 해줘야 했음
  const decodingItemName = decodeURIComponent(itemName);
  const version = await fetchVersion();
  const res = await fetch(
    `https://ddragon.leagueoflegends.com/cdn/${version}/data/ko_KR/item.json`
  );

  const { data } = await res.json();

  const dataArr: Item[] = Object.values(data);

  const theItemData = dataArr.filter((item) => {
    return item.name === decodingItemName;
  });

  return theItemData[0];
}
