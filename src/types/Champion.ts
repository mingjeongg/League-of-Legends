export type Champion = {
  name: string;
  key: string;
  title: string;
  image: {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
  // [key: string]: any; // 나머지 애들은 type 상관없고, 얼마든지 추가 가능 (어떠한 key type은 string이고 value는 any type)
  // 이거 안적어줘도 다른 것들은 any로 추론 잘 되지만, 다른 value가 있다는 것을 티내기 위해서 명시적으로 적어주면 좋긴함
};

export type ChampionDetail = {
  name: string;
  key: string;
  title: string;
  image: {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
  blurb: string;
  info: {
    attack: number;
    defense: number;
    magic: number;
    difficulty: number;
  };
};

// Record 객체로 만들건데 key가 string이고 value가 ChampionDetail인 객체다
// (데이터 구조 상 이렇게 써야했음)
export type ChampionName = Record<string, ChampionDetail>;
