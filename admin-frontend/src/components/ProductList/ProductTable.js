import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  Box,
} from "@chakra-ui/react";
import ProductRow from "./ProductRow";

const ProductTable = ({
  products,
  isDeleteMode,
  isEditMode,
  handleSelectProduct,
  selectedProducts,
}) => (
  <Box maxH="calc(100vh - 120px)" overflowY="unset">
    <TableContainer>
      <Table variant="simple" size="sm" width="100%">
        <Thead
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            backgroundColor: "teal",
          }}
        >
          <Tr>
            {(isDeleteMode || isEditMode) && (
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
              isEditMode={isEditMode}
              handleSelectProduct={handleSelectProduct}
              selectedProducts={selectedProducts}
            />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  </Box>
);

export default ProductTable;
