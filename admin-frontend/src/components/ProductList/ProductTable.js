import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Image,
  Tooltip,
  Checkbox,
  Badge,
} from "@chakra-ui/react";
import ProductRow from "./ProductRow";

const ProductTable = ({
  products,
  isDeleteMode,
  handleSelectProduct,
  selectedProducts,
}) => (
  <TableContainer>
    <Table variant="simple" size="sm" height="100%" width="100%">
      <Thead position="sticky" top={0} bg="teal.500" zIndex={1}>
        <Tr>
          {isDeleteMode && (
            <Th color="white" p={2}>
              Select
            </Th>
          )}
          <Th color="white" p={2}>
            ID
          </Th>
          <Th color="white" p={2}>
            Name
          </Th>
          <Th color="white" p={2}>
            Description
          </Th>
          <Th color="white" p={2}>
            Price
          </Th>
          <Th color="white" p={2}>
            Quantity
          </Th>
          <Th color="white" p={2}>
            Unit
          </Th>
          <Th color="white" p={2}>
            Image
          </Th>
          <Th color="white" p={2}>
            Is Special
          </Th>
          <Th color="white" p={2}>
            Special Price
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {products.map((product) => (
          <ProductRow
            key={product.product_id}
            product={product}
            isDeleteMode={isDeleteMode}
            handleSelectProduct={handleSelectProduct}
            selectedProducts={selectedProducts}
          />
        ))}
      </Tbody>
    </Table>
  </TableContainer>
);

export default ProductTable;
