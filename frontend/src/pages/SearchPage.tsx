import { FC } from "react";
import { useParams } from "react-router-dom";

interface SearchPageProps {}

const SearchPage: FC<SearchPageProps> = ({}) => {
  const params = useParams();
  return <div>SearchPage {params.city}</div>;
};

export default SearchPage;
