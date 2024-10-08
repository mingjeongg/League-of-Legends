[문제 발생 1 - encoding, decoding]

export async function fetchItemDetail(itemName: string) {

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

fetchItemDetail 함수를 호출하고 있는 items/itemName/page.tsx에서 위 함수를 호출하고 사용하려는데
호출하여 return 받은 data에 name이라는 속성이 없다고 오류가 발생함

---

[원인 추론 1]

하나 하나 콘솔 찍어보며 확인하여, fetchItemDetail 함수를 호출하고 있는 items/itemName/page.tsx에서 인자로 props.params.itemName을 넘겨주고 itemName을 받아서 사용하려는데 잘 작동하지않는 것을 확인

인자로 받은 itemName이 이상하게 오는 것을 발견 (%23C 막 이런식으로)

이는 encoding 돼서 넘어온 것

여기서 encoding이란?

- 사람이 인지 할 수 있는 문자를 약속된 규칙에 따라 컴퓨터가 이해하는 언어(0, 1)로 이루어진 코드로 바꾸는 것
- 코드화, 암호화, 부호화 하여 형태 표준화, 보안, 저장 공간 절약 등을 위해서 사용됨

하여 decoding 해주어야 했음

---

[문제 해결 1]

export async function fetchItemDetail(itemName: string) {

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

- decodeURIComponent() 를 활용하여 다시 디코딩 해주고나니 문제가 해결 됨

---

[문제 발생 2 - 객체의 동적인 key에 접근하는 방법]

export async function fetchChampionDetail(championId: string) {
const version = await fetchVersion();

const res = await fetch(
`https://ddragon.leagueoflegends.com/cdn/${version}/data/ko_KR/champion/${championId}.json`
);

const { data } = await res.json();

if (!res.ok) {
return {
message: "Please enter a valid Champion Name",
status: res.status,
};
}

return data.championId;
}

- 위 함수를 호출하였으나 return 값으로 받은 data가 undefined로 뜸

---

[문제 원인 2]

data 구조상 객체안의 championId의 객체에 접근 해야 했음
히여 data.championId로 값을 return 하려 함

---

[문제 해결 2]

하지만 이 championId는 '동적'(고정값 X) 이기 때문에 data.championId 은 적절하지 않음
객체임에도 불구하고 동적인 key에 접근하기 위해서는 data[championId]로 해야 접근해서 가져 올 수 있음

---

[이 외에 통해 배운 것 1 - type narrowing]

export type Props = {
params: {
championId: string;
};
};

const ChampionDetailPage = async ({ params }: Props) => {

const championInfo: ChampionDetail | ChampionDetailError =
await fetchChampionDetail(params.championId);
const version = await fetchVersion();

if ("message" in championInfo) {
return (

<div>
<h1>{championInfo.message}</h1>
<h2>{championInfo.status}</h2>
</div>
);
}

return <div></div>
};

- type narrowing

위 식을 보면 fetchChampionDetail이라는 함수를 호출하여 사용하고 있음
이 함수는 server api에 작성해둔 것이고, error가 났을때는 에러 message와 status를 포함한 객체를 반환하게 처리해둠

하면 이 함수를 호출함으로써 받는 championInfo는 에러가 났을 경우와 안났을 경우 두가지 타입으로 나뉘게 됨

그리고 만약 성공해서 받은 데이터를 활용하기 위해서는 이 championData가 error가 났을때랑 안났을때 구별해서 로직을 짜야했음

처음에는 if (typeof championData === ChampionDetail) {return <div></div>}를 하려 하였으나 이 로직은 작동하지 않음

이럴경우 type narrowing 한 방법을 사용 할 수 있음

=> type narrowing 로직 설명
championInfo에 message 속성이 있으면 return 해라
return 함으로써 message가 있으면 밑으로 흘러내려오지 않는다는 것을 보장하고 따라서 뭔가가 내려온다면 내려오는 것은 무조건 message가 없는 것 즉 errorr가 아닌 것이라는 것을 보장한다
따라서 return 필요하다

---

[ 이 외에 통해 배운 것 2 ]

- .env.local 파일에 있는 것을 사용하여 데이터를 fetch 해야 할 때

env파일에 있는 것들은 runtime때에만 확인 가능, 근데 typeScript는 런타임 전에 읽는다
그래서 typeScript가 env 파일에 어떤값이 있는지, 값이 있긴 한건지는 모르니까 env 파일 안에 있는 것의 type을 string | undefined로 추론
하지만 header는 KEY(env파일안에있는것)가 undefined는 용납 못해
headers는 X-Riot-Token이 string이여야만 한다고 생각해서 key값이 없을때는 빈문자열로 type 지정하면 오류 안남

export async function GET() {
// 1. 환경변수에서 API 키 가져오기
const KEY = process.env.RIOT_API_KEY;

// 2. Riot Games API 호출 (요청 헤더에 X-Riot-Token을 설정하여 API 키 포함시켜)
const res = await fetch(
"https://kr.api.riotgames.com/lol/platform/v3/champion-rotations",
{
headers: {
"X-Riot-Token": KEY || "",
},
cache: "no-store",
}
);

const data = await res.json()

return NextResponse.json(data);
}
