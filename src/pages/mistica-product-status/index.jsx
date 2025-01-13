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

  // Estados por componente
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
      <Tag type="active">Kénos</Tag>,
      <Tag type="active">Kénos</Tag>,
      <Tag type="active">Kénos</Tag>,
      <Tag type="active">Kénos</Tag>,
    ],
  };

  // URLs o acciones específicas para cada fila
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

  const columnAlign = [
    "left",
    "center",
    "center",
    "center",
    "center",
    "center",
    "center",
  ];

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

  const components = Object.keys(componentStatuses); // Lista de componentes

  return (
    <>
      <Box paddingY={40} paddingBottom={80}>
        <ResponsiveLayout>
          <Stack space={-1}>
            <Table
              boxed
              columnWidth={[200, 96, 96, 96, 96, 96]}
              heading={[
                "",
                "Country",
                <Inline space={8} alignItems="center">
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
                <Inline space={8} alignItems="center">
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

                <Inline space={8} alignItems="center">
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
                <Inline space={8} alignItems="center">
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
              ]}
              columnTextAlign={columnAlign}
              content={components.map((component) => ({
                cells: [
                  component, // Nombre del componente
                  ...componentStatuses[component], // Estados del componente
                ],
                actions: [
                  /*
{
Icon: IconArrowLineUpRightRegular, // Ícono de la acción
onPress: () => {
window.open(urls[component], "_blank"); // Abre una URL específica para cada componente
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
