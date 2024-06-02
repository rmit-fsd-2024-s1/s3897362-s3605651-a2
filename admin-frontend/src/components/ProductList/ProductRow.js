import React from "react";
import { Tr, Td, Checkbox, Image, Tooltip, Badge } from "@chakra-ui/react";

const ProductRow = ({
  product,
  isDeleteMode,
  isEditMode,
  handleSelectProduct,
  selectedProducts,
}) => (
  <Tr>
    {(isDeleteMode || isEditMode) && (
      <Td p={2}>
        <Checkbox
          isChecked={selectedProducts.includes(product.product_id)}
          onChange={() => handleSelectProduct(product.product_id)}
        />
      </Td>
    )}
    <Td p={2}>{product.product_id}</Td>
    <Td p={2}>{product.name}</Td>
    <Td p={2} maxWidth="150px" whiteSpace="normal" wordBreak="break-word">
      {product.description}
    </Td>
    <Td fontWeight="bold" color="gray.600" p={2}>
      ${product.price}
    </Td>
    <Td p={2}>{product.quantity}</Td>
    <Td p={2}>{product.unit}</Td>
    <Td p={2}>
      <Tooltip
        label={
          <Image borderRadius={10} src={product.image} alt={product.name} />
        }
        placement="right"
        hasArrow
        bg="rgba(128, 128, 128, 0.4)"
        padding={1}
        borderRadius={10}
      >
        <Image
          src={product.image}
          alt={product.name}
          borderRadius={3}
          boxSize="50px"
          cursor="pointer"
        />
      </Tooltip>
    </Td>
    <Td p={2}>
      {product.isSpecial ? (
        <Badge colorScheme="green">Yes</Badge>
      ) : (
        <Badge colorScheme="red">No</Badge>
      )}
    </Td>
    <Td
      p={2}
      fontWeight={product.specialPrice ? "bold" : "normal"}
      color={product.specialPrice ? "green.500" : "gray.500"}
      fontStyle={product.specialPrice ? "normal" : "italic"}
    >
      {product.specialPrice ? `$${product.specialPrice}` : "N/A"}
    </Td>
  </Tr>
);

export default ProductRow;
