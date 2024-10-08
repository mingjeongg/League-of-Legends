import { ChampionDetail } from "@/types/Champion";
import { Error } from "@/types/Error";

import { fetchChampionDetail, fetchVersion } from "@/utils/serverApi";
import Image from "next/image";

export type Props = {
  params: {
    championId: string;
  };
};

export async function generateMetadata({ params }: Props) {
  return {
    title: `${params.championId} 상세 정보`,
    description: `lol 챔피언 ${params.championId}에 대한 상세정보 입니다`,
  };
}

// {params} = params: {championId: string;}   // props: { params: {championId: string;} }
const ChampionDetailPage = async ({ params }: Props) => {
  // server action fetchChampionDetail함수가 인자를 championId로 받고 있어서 이거 맞춰줘야함
  const championInfo: ChampionDetail | Error = await fetchChampionDetail(
    params.championId
  );
  const version = await fetchVersion();

  if ("message" in championInfo) {
    // championInfo에 message 속성이 있으면 return 해라
    // return 함으로써 message가 있으면 밑으로 흘러내려오지 않는다는 것을 보장하고 따라서 뭔가가 내려온다면
    // 내려오는 것은 무조건 message가 없는 것 즉 errorr가 아닌 것이라는 것을 보장한다 따라서 return 필요하다
    //---------------------------------------------------------------------------------------
    // 글고 얘는 컴포넌트 안에서 return 하고 있기 때문에 이렇게 하면 에러 객체 받았을때 error.message와 error.state가 화면에 잘 뜸
    // 만약 컴포넌트 안에 함수 안에서 if(){return}을 하게 하면 이는 화면에 <div> return 안됨
    // 이는 rotation page에서 참고 가능
    //---------------------------------------------------------------------------------------
    // fetchChampionDetail을 실행하면 반환하는 값을 championInfo에 담음 즉 championInfo로 반환되는 객체에 접근 가능
    return (
      <div>
        <h1>{championInfo.message}</h1>
        <h2>{championInfo.status}</h2>
      </div>
    );
  }

  return (
    <div className="p-10 mx-auto max-w-3xl">
      <h1 className="text-4xl mt-10 font-bold mb-4 text-rose-700">
        {championInfo.name}
      </h1>
      <h2 className="text-2xl text-gray-600 mb-4">{championInfo.title}</h2>
      <Image
        className="mx-auto"
        // image는 롤에 있음 하면 lol doc가서 이미지 주소 가져와야함
        src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championInfo.id}.png`}
        alt="이미지 없음"
        width={200}
        height={200}
      />
      <p className="mt-4 text-rose-700">{championInfo.blurb}</p>
      <div className="mt-6 text-rose-700">
        <h3 className="text-xl font-semibold">스탯</h3>
        <ul className="mt-1">
          <li>• 공격력: {championInfo.info.attack}</li>
          <li>• 방어력: {championInfo.info.defense}</li>
          <li>• 마법력: {championInfo.info.magic}</li>
          <li>• 난이도: {championInfo.info.difficulty}</li>
        </ul>
      </div>
    </div>
  );
};

export default ChampionDetailPage;
