"use client"; // Error component 는 꼭 클라이언트 컴포넌트여야한다는 점 !!

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      {/* <h2>{error.message}</h2> */}
      {/* // 이렇게 하면 thorw 했던 error 의 message가 뜸 */}
      <h2>챔피언을 불러오는데 실패했습니다. 다시 시도해주세요</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
