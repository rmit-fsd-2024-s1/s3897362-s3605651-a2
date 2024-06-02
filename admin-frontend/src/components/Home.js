import React from "react";
import { useQuery, gql } from "@apollo/client";

const GET_PRODUCTS = gql`
  query GetAllProducts {
    getAllProducts {
      name
      isSpecial
    }
  }
`;

const Home = () => {
  const { loading, error, data } = useQuery(GET_PRODUCTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const specialProducts = data.getAllProducts.filter(
    (product) => product.isSpecial
  );

  return (
    <div>
      <h1>Special Products:</h1>
      {specialProducts.map((product) => (
        <p key={product.name}>{product.name}</p>
      ))}
    </div>
  );
};

export default Home;
