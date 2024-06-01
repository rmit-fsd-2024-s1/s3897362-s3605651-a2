import React from "react";
import { useQuery, gql } from "@apollo/client";

const GET_PRODUCTS = gql`
  query GetAllProducts {
    getAllProducts {
      product_id
      name
      description
      price
      quantity
      unit
      image
      isSpecial
      specialPrice
    }
  }
`;

const ProductList = () => {
  const { loading, error, data } = useQuery(GET_PRODUCTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Unit</th>
          <th>Image</th>
          <th>Is Special</th>
          <th>Special Price</th>
        </tr>
      </thead>
      <tbody>
        {data.getAllProducts.map((product) => (
          <tr key={product.product_id}>
            <td>{product.product_id}</td>
            <td>{product.name}</td>
            <td>{product.description}</td>
            <td>{product.price}</td>
            <td>{product.quantity}</td>
            <td>{product.unit}</td>
            <td>
              <img
                src={product.image}
                alt={product.name}
                style={{ width: "50px" }}
              />
            </td>
            <td>{product.isSpecial ? "Yes" : "No"}</td>
            <td>{product.specialPrice || "N/A"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductList;
