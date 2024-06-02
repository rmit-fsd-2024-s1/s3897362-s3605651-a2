import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { Box } from "@chakra-ui/react";

const SpecialPie = ({ chartData }) => {
  return (
    <Box boxShadow="lg" p="6" rounded="md" bg="white">
      <div style={{ height: 400 }}>
        <ResponsivePie
          data={chartData}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          colors={{ scheme: "nivo" }}
          borderWidth={1}
          borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
        />
      </div>
    </Box>
  );
};

export default SpecialPie;
