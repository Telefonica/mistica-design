import React from "react"; // All comments are in English
import {
  FadeIn,
  Image,
  Inline,
  Table,
  Text3,
  Spinner,
  Tag,
  Text1,
  Box,
  ResponsiveLayout,
  Stack,
  skinVars,
  Tooltip,
  IconInformationRegular,
} from "@telefonica/mistica";

const ProductStatus = () => {
  // Component to show a "Done" icon
  const Done = () => (
    <Inline space="around">
      <FadeIn duration="1000ms">
        <Image
          loadingFallback={false}
          width={24}
          height={24}
          src="https://raw.githubusercontent.com/Telefonica/mistica-icons/refs/heads/production/.github/resources/done.svg"
        />
      </FadeIn>
    </Inline>
  );

  // Component to show a "Pending" icon
  const Pending = () => (
    <Inline space="around">
      <FadeIn duration="1000ms">
        <Image
          loadingFallback={false}
          width={24}
          height={24}
          src="https://raw.githubusercontent.com/Telefonica/mistica-icons/production/.github/resources/pending.svg"
        />
      </FadeIn>
    </Inline>
  );

  // Component to show a spinner (Work in Progress)
  const Wip = ({ size }) => (
    <Inline space="around">
      <FadeIn duration="1000ms">
        <Spinner size={size} color={skinVars.colors.success} />
      </FadeIn>
    </Inline>
  );
  Wip.defaultProps = {
    size: 16,
  };

  // Component to show a "N/A" icon
  const Na = () => (
    <Inline space="around">
      <FadeIn duration="1000ms">
        <Image
          loadingFallback={false}
          width={24}
          height={24}
          src="https://raw.githubusercontent.com/Telefonica/mistica-icons/production/.github/resources/na.svg"
        />
      </FadeIn>
    </Inline>
  );

  // Component to show an "Unknown" icon
  const Unknown = ({ size }) => (
    <Inline space="around">
      <FadeIn duration="1000ms">
        <Text3 medium color={skinVars.colors.textSecondary}>
          ?
        </Text3>
      </FadeIn>
    </Inline>
  );
  Unknown.defaultProps = {
    size: 24,
  };

  // States for each component.
  // Each array contains: [Country, Design Guidelines, Design Libs, Code integration, Production]
  const componentStatuses = {
    "Mi Movistar (App)": [
      "Spain",
      <Done /> /* Design Guidelines */,
      <Done /> /* Design Libs */,
      <Done /> /* Code integration */,
      <Done /> /* Production */,
    ],
    "Meu Vivo (App)": [
      "Brazil",
      <Done /> /* Design Guidelines */,
      <Done /> /* Design Libs */,
      <Done /> /* Code integration */,
      <Done /> /* Production */,
    ],
    "Mi O2 (App)": [
      "Spain",
      <Done /> /* Design Guidelines */,
      <Done /> /* Design Libs */,
      <Done /> /* Code integration */,
      <Done /> /* Production */,
    ],
    "Mi O2 (Web)": [
      "Spain",
      <Done /> /* Design Guidelines */,
      <Done /> /* Design Libs */,
      <Done /> /* Code integration */,
      <Done /> /* Production */,
    ],
    "My O2 (App)": [
      "UK",
      <Done /> /* Design Guidelines */,
      <Done /> /* Design Libs */,
      <Done /> /* Code integration */,
      <Done /> /* Production */,
    ],
    "Mein O2 (App)": [
      "Germany",
      <Done /> /* Design Guidelines */,
      <Done /> /* Design Libs */,
      <Done /> /* Code integration */,
      <Done /> /* Production */,
    ],
    "Mein Blau (App)": [
      "Germany",
      <Done /> /* Design Guidelines */,
      <Done /> /* Design Libs */,
      <Done /> /* Code integration */,
      <Done /> /* Production */,
    ],
    "Novum CMS (Web)": [
      "Global",
      <Done /> /* Design Guidelines */,
      <Done /> /* Design Libs */,
      <Done /> /* Code integration */,
      <Done /> /* Production */,
    ],
    "Digital Payments (App / Web)": [
      "Global",
      <Done /> /* Design Guidelines */,
      <Done /> /* Design Libs */,
      <Done /> /* Code integration */,
      <Done /> /* Production */,
    ],
    "TU Wallet (App)": [
      "Spain",
      <Done /> /* Design Guidelines */,
      <Done /> /* Design Libs */,
      <Done /> /* Code integration */,
      <Done /> /* Production */,
    ],
    "TU Wallet (Web)": [
      "Spain",
      <Done /> /* Design Guidelines */,
      <Done /> /* Design Libs */,
      <Pending /> /* Code integration */,
      <Done /> /* Production */,
    ],
    "TU Latch (App)": [
      "Spain",
      <Done /> /* Design Guidelines */,
      <Done /> /* Design Libs */,
      <Done /> /* Code integration */,
      <Done /> /* Production */,
    ],
    "TU Latch (Web)": [
      "Spain",
      <Done /> /* Design Guidelines */,
      <Done /> /* Design Libs */,
      <Pending /> /* Code integration */,
      <Done /> /* Production */,
    ],
    "TU.com (Web)": [
      "Spain",
      <Done /> /* Design Guidelines */,
      <Done /> /* Design Libs */,
      <Done /> /* Code integration */,
      <Done /> /* Production */,
    ],
    "Fonditel (App)": [
      "Spain",
      <Done /> /* Design Guidelines */,
      <Done /> /* Design Libs */,
      <Done /> /* Code integration */,
      <Done /> /* Production */,
    ],
    "Fonditel (Web)": [
      "Spain",
      <Done /> /* Design Guidelines */,
      <Done /> /* Design Libs */,
      <Done /> /* Code integration */,
      <Done /> /* Production */,
    ],
    "Network Tokenization (App)": [
      "Spain",
      <Done /> /* Design Guidelines */,
      <Done /> /* Design Libs */,
      <Done /> /* Code integration */,
      <Done /> /* Production */,
    ],
    "Smart Wifi (App)": [
      "Spain & Brazil",
      <Done /> /* Design Guidelines */,
      <Done /> /* Design Libs */,
      <Done /> /* Code integration */,
      <Done /> /* Production */,
    ],
    "NFT Marketplace (Web)": [
      "Spain & Brazil",
      <Pending /> /* Design Guidelines */,
      <Done /> /* Design Libs */,
      <Done /> /* Code integration */,
      <Done /> /* Production */,
    ],
    "Vivo Movel": [
      "Brazil",
      <Done /> /* Design Guidelines */,
      <Done /> /* Design Libs */,
      <Done /> /* Code integration */,
      <Done /> /* Production */,
    ],
    "Vivo Seguros": [
      "Brazil",
      <Done /> /* Design Guidelines */,
      <Done /> /* Design Libs */,
      <Done /> /* Code integration */,
      <Done /> /* Production */,
    ],
    "Conexión Segura (App)": [
      "Spain",
      <Done /> /* Design Guidelines */,
      <Done /> /* Design Libs */,
      <Done /> /* Code integration */,
      <Done /> /* Production */,
    ],
    "Movistar Money (Web)": [
      "Spain",
      <Wip /> /* Design Guidelines */,
      <Done /> /* Design Libs */,
      <Pending /> /* Code integration */,
      <Pending /> /* Production */,
    ],
    "Telefónica Cloud Portal": [
      "Spain",
      <Done /> /* Design Guidelines */,
      <Done /> /* Design Libs */,
      <Unknown /> /* Code integration */,
      <Unknown /> /* Production */,
    ],
    "Telefónica Open Gateway (C4TP)": [
      "Spain",
      <Done /> /* Design Guidelines */,
      <Done /> /* Design Libs */,
      <Unknown /> /* Code integration */,
      <Unknown /> /* Production */,
    ],
    "Opengateway Sandbox": [
      "Spain",
      <Done /> /* Design Guidelines */,
      <Done /> /* Design Libs */,
      <Done /> /* Code integration */,
      <Done /> /* Production */,
    ],
    "E-Care": [
      "Ecuador",
      <Unknown /> /* Design Guidelines */,
      <Done /> /* Design Libs */,
      <Unknown /> /* Code integration */,
      <Unknown /> /* Production */,
    ],
    Aura: [
      "Ecuador",
      <Unknown /> /* Design Guidelines */,
      <Done /> /* Design Libs */,
      <Unknown /> /* Code integration */,
      <Unknown /> /* Production */,
    ],
    "Movistar Music": [
      "Global",
      <Done /> /* Design Guidelines */,
      <Pending /> /* Design Libs */,
      <Pending /> /* Code integration */,
      <Done /> /* Production */,
    ],
    Hispam: [
      "Arg / Chile",
      <Tag type="active">Kénos</Tag> /* Design Guidelines */,
      <Tag type="active">Kénos</Tag> /* Design Libs */,
      <Tag type="active">Kénos</Tag> /* Code integration */,
      <Tag type="active">Kénos</Tag> /* Production */,
    ],
  };

  // URLs or specific actions for each row (not modified in this example)
  const urls = {
    Accordion:
      "https://brandfactory.telefonica.com/document/1846#/components/accordion",
    Avatar: "https://example.com/avatar",
    Badge: "https://example.com/badge",
    Breadcrumbs: "https://example.com/breadcrumbs",
    "Bulleted list": "https://example.com/bulleted-list",
    Buttons: "https://example.com/buttons",
    Callout: "https://example.com/callout",
  };

  // Column alignment – adjust to the number of columns (here we have 6 columns)
  const columnAlign = [
    "left",
    "center",
    "center",
    "center",
    "center",
    "center",
  ];

  // Legend component (unchanged)
  const Legend = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "right",
        float: "right",
        width: "fit-content",
        border: "1px solid",
        borderColor: skinVars.colors.border,
        borderRadius: skinVars.borderRadii.container,
        padding: 12,
      }}
    >
      <Inline space={24}>
        <Inline alignItems="center" space={4}>
          <Done />
          <Text1 color={skinVars.colors.textSecondary}>Available</Text1>
        </Inline>
        <Inline alignItems="center" space={4}>
          <div
            style={{
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Wip size={16} />
          </div>
          <Text1 color={skinVars.colors.textSecondary}>Work in progress</Text1>
        </Inline>
        <Inline alignItems="center" space={4}>
          <Pending />
          <Text1 color={skinVars.colors.textSecondary}>Pending</Text1>
        </Inline>
        <Inline alignItems="center" space={8}>
          <Unknown />
          <Text1 color={skinVars.colors.textSecondary}>Unknown</Text1>
        </Inline>
      </Inline>
    </div>
  );

  // -------------------------------
  // Compute counts for each column.
  // The table rows are constructed as:
  //   - Column 0: Component name
  //   - Columns 1..N: The values from componentStatuses (e.g., Country, Design Guidelines, etc.)
  // For each cell:
  //   - For the Country column (column 1): add the country if it exists and count only unique values.
  //   - For other string cells: count if non-empty.
  //   - For React elements: count if the element type equals Done.
  // -------------------------------
  const components = Object.keys(componentStatuses);
  const totalColumns =
    1 +
    (componentStatuses[components[0]]
      ? componentStatuses[components[0]].length
      : 0);

  // Initialize an array for counts and a set for unique countries (column 1)
  const doneCounts = new Array(totalColumns).fill(0);
  const countrySet = new Set();

  components.forEach((componentName) => {
    // Column 0: component name (count if non-empty)
    if (
      componentName &&
      typeof componentName === "string" &&
      componentName.trim() !== ""
    ) {
      doneCounts[0] += 1;
    }
    // Get the row data from componentStatuses (for columns 1..totalColumns-1)
    const rowData = componentStatuses[componentName];
    rowData.forEach((cell, i) => {
      const colIndex = i + 1; // Adjust index since first column is component name
      if (colIndex === 1) {
        // For Country column: add to the set if the cell is a non-empty string
        if (typeof cell === "string" && cell.trim() !== "") {
          countrySet.add(cell.trim());
        }
      } else {
        if (typeof cell === "string") {
          if (cell.trim() !== "") {
            doneCounts[colIndex] += 1;
          }
        } else if (React.isValidElement(cell)) {
          if (cell.type === Done) {
            doneCounts[colIndex] += 1;
          }
        }
      }
    });
  });
  // Update the Country column count (column 1) with the number of unique countries
  doneCounts[1] = countrySet.size;

  // -------------------------------
  // Create headers and insert the count between the header name and the tooltip (if any).
  // -------------------------------
  const headings = [
    "Product", // First column header: component name
    "Country",
    <Inline key="design-guidelines" space={8} alignItems="center">
      Design guidelines
      <Tooltip
        delay={false}
        target={
          <IconInformationRegular
            size={12}
            color={skinVars.colors.neutralMedium}
          />
        }
        description="Applies the visual style of the design system but does not use its components or the full system."
      />
    </Inline>,
    <Inline key="design-libraries" space={8} alignItems="center">
      Design libraries
      <Tooltip
        delay={false}
        target={
          <IconInformationRegular
            size={12}
            color={skinVars.colors.neutralMedium}
          />
        }
        description="Uses the provided design libraries but is not implemented in code."
      />
    </Inline>,
    <Inline key="code-libraries" space={8} alignItems="center">
      Code libraries
      <Tooltip
        delay={false}
        target={
          <IconInformationRegular
            size={12}
            color={skinVars.colors.neutralMedium}
          />
        }
        description="Implements the design system libraries in code for development."
      />
    </Inline>,
    <Inline key="production" space={8} alignItems="center">
      Production
      <Tooltip
        delay={false}
        target={
          <IconInformationRegular
            size={12}
            color={skinVars.colors.neutralMedium}
          />
        }
        description="The product is live and uses the design system in production."
      />
    </Inline>,
  ];

  const enhancedHeadings = headings.map((heading, index) => {
    const count = doneCounts[index];
    if (!heading) return heading;
    // For simple string headers, just append the count.
    if (typeof heading === "string") {
      return `${heading} (${count})`;
    }
    // For React element headers, we try to insert the count between the header text and the tooltip.
    if (React.isValidElement(heading)) {
      const childrenArray = React.Children.toArray(heading.props.children);
      // Check if there's at least one child and if the first child is a string.
      if (childrenArray.length >= 2 && typeof childrenArray[0] === "string") {
        // Insert the count as a separate node between the header text and the rest (which includes the tooltip).
        const newChildren = [
          childrenArray[0],
          ` (${count})`,
          ...childrenArray.slice(1),
        ];
        return React.cloneElement(heading, { key: index }, ...newChildren);
      } else if (childrenArray.length && typeof childrenArray[0] === "string") {
        // In case there's only one child, append the count to it.
        const newChildren = [`${childrenArray[0]} (${count})`];
        return React.cloneElement(heading, { key: index }, ...newChildren);
      }
      // Fallback: append count at the end.
      return React.cloneElement(
        heading,
        { key: index },
        ...childrenArray,
        ` (${count})`
      );
    }
    return heading;
  });

  return (
    <>
      <Box padding={40} paddingBottom={80}>
        <ResponsiveLayout fullWidth>
          <Stack space={-1}>
            <Table
              boxed
              columnWidth={[200, 96, 96, 96, 96, 96]}
              heading={enhancedHeadings}
              columnTextAlign={columnAlign}
              content={components.map((componentName) => ({
                // The first cell is the component name; then spread the row data from componentStatuses.
                cells: [componentName, ...componentStatuses[componentName]],
                actions: [
                  /*
                  {
                    Icon: IconArrowLineUpRightRegular, // Action icon
                    onPress: () => {
                      window.open(urls[componentName], "_blank"); // Open specific URL
                    },
                    label: "View Details",
                  },
                  */
                ],
              }))}
            />

            <Legend />
          </Stack>
        </ResponsiveLayout>
      </Box>
    </>
  );
};

export default ProductStatus;
