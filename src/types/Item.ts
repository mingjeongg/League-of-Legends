export type Item = {
  name: string;
  plaintext: string;
  image: {
    full: string;
  };
  tags: string[];
  gold: {
    base: number;
    purchasable: boolean;
    sell: number;
  };
};
