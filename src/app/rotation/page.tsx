"use client";

// use Client써도 서버에서 실행 되는 건(서버 사이드 렌더링) 같다
// use client 쓰면 클라이언트 컴포넌트 되는데 , 이는 csr은 아니다.
// 일부만 csr  일부는 ssr
// 즉 서버사이드렌더링에 클라이언트 컴포넌트를 끼워넣는거다

import { Champion } from "@/types/Champion";
import { Error } from "@/types/FetchError";
import { fetchVersion } from "@/utils/serverApi";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const ChampionRotationPage = () => {
  const fetchRotationChampionData = async () => {
    // 만든 route handler 사용법 (api폴더 안에 rotation안에 route.ts 만들어서 여기에 route handler 만듬)
    const res = await fetch(`/api/rotation`);
    const data: Champion[] | Error = await res.json();

    setData(data);
    setIsLoading(false);
    // 처음엔 이 식을 useEffect에 넣음 근데 거기에 넣으면 fetchRotationChampion을 기다려주지 않기 때문애 이 식의 위치를 여기로 이동
    // 왜냐하면 useEffect식에 바로 async await 못쓰기 때문에
  };

  const getVersionData = async () => {
    const version = await fetchVersion();

    setVersion(version);
  };

  const [data, setData] = useState<Champion[] | Error>([]);
  const [version, setVersion] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchRotationChampionData();
    getVersionData();
  }, []);

  if ("message" in data) {
    return (
      <div>
        <h1>{data.message}</h1>
        <h2>{data.status}</h2>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="ml-10 text-3xl w-full mx-auto font-bold mt-10 mb-4 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <h1 className=" ml-10 text-3xl font-bold mt-10 mb-4 text-rose-700">
        챔피언 로테이션
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
export default ChampionRotationPage;
