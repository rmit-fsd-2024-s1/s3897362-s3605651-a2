import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { Box } from "@chakra-ui/react";

const SpecialPie = ({ chartData }) => {
  return (
    <Box width="100%" height="100%">
      <div style={{ height: 400, width: "100%" }}>
        <ResponsivePie
          data={chartData}
          colors={{ scheme: "accent" }}
          margin={{ top: 30, right: 100, bottom: 100, left: 100 }}
          innerRadius={0.5}
          padAngle={0.9}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          borderColor={{
            from: "color",
            modifiers: [["darker", 0.2]],
          }}
          tooltip={({ datum }) => (
            <div
              style={{
                backgroundColor: "rgba(249, 249, 249, 0.9)",
                border: "1px solid #ccc",
                borderRadius: "15px",
                boxShadow: "2px 2px 2px #ccc",
                padding: "10px",
                maxWidth: "200px",
              }}
            >
              <strong>{datum.label}</strong>
              <ul style={{ listStyleType: "none" }}>
                {" "}
                {/* Remove bullet points here */}
                {datum.data.productNames.map((name) => (
                  <li key={name}>- {name}</li>
                ))}
              </ul>
            </div>
          )}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: "color" }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor="#FFFFFF" // Change color to white
          theme={{
            labels: {
              text: {
                fontWeight: "bold", // Make text bolder
              },
            },
          }}
          legends={[
            {
              anchor: "bottom",
              direction: "row",
              justify: false,
              translateX: 0,
              translateY: 56,
              itemsSpacing: 0,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: "#999",
              itemDirection: "left-to-right",
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: "circle",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemTextColor: "#000",
                  },
                },
              ],
            },
          ]}
        />
      </div>
    </Box>
  );
};

export default SpecialPie;
