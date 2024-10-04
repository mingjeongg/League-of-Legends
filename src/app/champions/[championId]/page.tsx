export type Props = {
  params: {
    championId: string;
  };
};

// {params} = params: {championId: string;}   // props: { params: {championId: string;} }
const ChampionDetailPage = ({ params }: Props) => {
  return <div></div>;
};
export default ChampionDetailPage;
