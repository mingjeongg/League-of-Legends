import Image from "next/image";
import Link from "next/link";
// 이미지 파일 사용할때 이미지 경로만 잘 잡아주면 어떤 이름으로 사용할지는 여기서 내가 맘대로 지정이 가능하다
import FirstImage from "../public/assets/image.png";
import SecondImage from "../public/assets/image copy.png";
import ThirdImage from "../public/assets/image copy 2.png";

// 마크업을 마크업로직? 작성할때는 시멘틱하게 - 무분별한 div사용 금지, 의미있는 태그 사용 안했을때
// css 인라인요소, 블록요소, flex, grid 공부하기
export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center px-auto my-10 ">
      <h1 className="text-rose-700 text-3xl font-bold mt-10">
        리그 오브 레전드 정보 앱
      </h1>
      <h5 className="mt-4 text-gray-500">
        Riot Games API를 활용하여 챔피언과 아이템 정보를 제공합니다
      </h5>
      <div>
        <Link href={"/champions"}>
          <div className="mt-10 mx-atuo flex flex-col justify-center items-center gap-4">
            <Image src={SecondImage} alt="image" width={400} height={300} />
            <p className="text-amber-400"> 챔피언 목록 보기</p>
          </div>
        </Link>

        <Link href={"/champions"}>
          <div className="mt-10 mx-atuo flex flex-col justify-center items-center gap-4">
            <Image src={ThirdImage} alt="image" width={400} height={300} />
            <p className="text-amber-400"> 금주 로테이션 확인</p>
          </div>
        </Link>

        <Link href={"/champions"}>
          <div className="mt-10 mx-atuo flex flex-col justify-center items-center gap-4 ">
            <Image src={FirstImage} alt="image" width={400} height={300} />
            <p className="text-amber-400"> 아이템 목록 보기</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
