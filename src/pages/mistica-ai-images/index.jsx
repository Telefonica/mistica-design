import React, { useState } from "react";
import {
  Image,
  Stack,
  ButtonPrimary,
  Text,
  Inline,
  IconButton,
  IconControlsRegular,
  MovistarLogo,
  Align,
  Box,
  skinVars,
  ResponsiveLayout,
  TelefonicaLogo,
  VivoLogo,
  O2NewLogo,
  RadioGroup,
  RadioButton,
  Text7,
  Drawer,
  Slider,
  Tag,
} from "@telefonica/mistica";
import logo from "../../img/mistica_logo_isotype.svg";

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // API configuration states
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [model, setModel] = useState("dev");
  const [goFast, setGoFast] = useState(false);
  const [loraScale, setLoraScale] = useState(1);
  const [megapixels, setMegapixels] = useState("1");
  const [numOutputs, setNumOutputs] = useState(1);
  const [outputFormat, setOutputFormat] = useState("png");
  const [guidanceScale, setGuidanceScale] = useState(3);
  const [outputQuality, setOutputQuality] = useState(100);
  const [promptStrength, setPromptStrength] = useState(0.8);
  const [extraLoraScale, setExtraLoraScale] = useState(1);
  const [numInferenceSteps, setNumInferenceSteps] = useState(28);

  const [selectedBrand, setSelectedBrand] = useState("0");
  // Definir los modelos para cada marca
  const brandModels = {
    0: "yceballost/movistar-images:3e6c5b6f16e335e7508c86f13f05de7db88ab5ab1d06be2b22c1fa3039856b3f", // Movistar
    1: "yceballost/telefonica-images-backgrounds:c2925b759104a63c0a2b13f9e505ee87c1266e96f8ec429ccf03476d416c9ea3", // Telefonica
    // Puedes agregar más modelos para Vivo y O2 cuando estén disponibles
    2: "yceballost/movistar-images:3e6c5b6f16e335e7508c86f13f05de7db88ab5ab1d06be2b22c1fa3039856b3f", // Vivo (usando Movistar temporalmente)
    3: "yceballost/movistar-images:3e6c5b6f16e335e7508c86f13f05de7db88ab5ab1d06be2b22c1fa3039856b3f", // O2 (usando Movistar temporalmente)
  };

  // Definir los prompts de sistema para cada marca
  const brandSystemPrompts = {
    0: ", is required to include an important element with brand blue color (#0B9CEA), MVSTR photo style", // Movistar
    1: ", include an important element with wood and blue brand color (#0066FF), TEFBACK photo style", // Telefonica
    2: ", include an important element with brand purple color (#660099), VIVO photo style", // Vivo
    3: ", include an important element with brand blue color (#0019A5), O2 photo style", // O2
  };
  const [error, setError] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const aspectRatioOptions = [
    { value: "1:1", label: "Cuadrado (1:1)" },
    { value: "16:9", label: "Horizontal (16:9)" },
    { value: "9:16", label: "Vertical (9:16)" },
    { value: "4:3", label: "Horizontal (4:3)" },
    { value: "3:4", label: "Vertical (3:4)" },
  ];

  const modelOptions = [
    { value: "dev", label: "Movistar Dev" },
    { value: "base", label: "Movistar Base" },
  ];

  const megapixelOptions = [
    { value: "0.25", label: "0.25 MP" },
    { value: "1", label: "1 MP" },
    { value: "2", label: "2 MP" },
  ];

  const outputFormatOptions = [
    { value: "png", label: "PNG" },
    { value: "jpg", label: "JPG" },
    { value: "webp", label: "WebP" },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    try {
      // Obtener el prompt de sistema para la marca seleccionada
      const brandSystemPrompt =
        brandSystemPrompts[selectedBrand] || brandSystemPrompts["0"];
      // Añadir el prompt de sistema al prompt del usuario
      const systemPrompt = `${prompt.trim()}${brandSystemPrompt}`;

      // Obtener el modelo para la marca seleccionada
      const modelVersion = brandModels[selectedBrand] || brandModels["0"];

      // Use absolute path for API with all configuration parameters
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: systemPrompt,
          model,
          modelVersion, // Añadir el modelo específico de la marca
          aspectRatio,
          goFast,
          loraScale,
          megapixels,
          numOutputs,
          outputFormat,
          guidanceScale,
          outputQuality,
          promptStrength,
          extraLoraScale,
          numInferenceSteps,
          selectedBrand, // Enviar la marca seleccionada
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al generar la imagen");
      }

      const data = await res.json();
      setImageUrl(data.image);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Error al generar la imagen");
    } finally {
      setLoading(false);
    }
  };

  // Brand logos array for cleaner code
  const brandLogos = [
    <div
      style={{
        borderRadius: 8,
        border: "1px solid",
        borderColor: skinVars.colors.border,
        width: 48,
        height: 48,
      }}
      key="movistar"
    >
      <Align x="center" y="center" height={52}>
        <MovistarLogo size={24} />
      </Align>
    </div>,
    <div
      style={{
        borderRadius: 8,
        border: "1px solid",
        borderColor: skinVars.colors.border,
        width: 48,
        height: 48,
        opacity: 0.5,
      }}
      key="telefonica"
    >
      <Align x="center" y="center" height={52}>
        <TelefonicaLogo size={24} />
      </Align>
    </div>,
    <div
      style={{
        borderRadius: 8,
        border: "1px solid",
        borderColor: skinVars.colors.border,
        width: 48,
        height: 48,
        opacity: 0.5,
      }}
      key="vivo"
    >
      <Align x="center" y="center" height={52}>
        <VivoLogo size={24} />
      </Align>
    </div>,
    <div
      style={{
        borderRadius: 8,
        border: "1px solid",
        borderColor: skinVars.colors.border,
        width: 48,
        height: 48,
        opacity: 0.5,
      }}
      key="o2"
    >
      <Align x="center" y="center" height={52}>
        <O2NewLogo size={24} />
      </Align>
    </div>,
  ];

  return (
    <ResponsiveLayout>
      <div style={{ position: "absolute", top: 64, left: 64 }}>
        <Inline space={16}>
          <Image src={logo} width={44} />
          <Tag type="active">BETA</Tag>
        </Inline>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          alignItems: "center",
          justifyContent: "space-evenly",
          height: "100vh",
          padding: "24px 0",
        }}
      >
        <Text7 textAlign="center">What image do you need?</Text7>

        <div
          style={{
            maxWidth: 1400,
            width: "100%",
            borderRadius: 56,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {error ? (
            <Align x="center">
              <Text variant="body2" color="error">
                {error}
              </Text>
            </Align>
          ) : imageUrl ? (
            <Image
              src={imageUrl}
              height="100%"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          ) : (
            <Image
              src="https://replicate.delivery/xezq/riMgvqnYpEKEOZYfDJXmef8fa0wRXg6AkrpIoATxK9zkwicTB/out-0.png"
              aspectRatio="16:9"
            />
          )}
        </div>

        <div
          style={{
            border: "1px solid",
            borderColor: skinVars.colors.border,
            borderRadius: 24,
            width: "100%",
            maxWidth: 650,
          }}
        >
          <Box padding={24}>
            <Stack space={32}>
              <Inline space="between" alignItems="center">
                <Stack space={8}>
                  <RadioGroup
                    name="brand-group"
                    value={selectedBrand}
                    onChange={setSelectedBrand}
                    disabled={selectedBrand}
                  >
                    <Inline space={8}>
                      {brandLogos.map((logo, idx) => (
                        <RadioButton
                          key={idx}
                          value={String(idx)}
                          render={({ checked, labelId }) => (
                            <div
                              style={{
                                transition: "all .07s ease-in-out",
                                outline: checked
                                  ? `2px solid ${skinVars.colors.brand}`
                                  : `0px solid ${skinVars.colors.border}`,
                                outlineOffset: checked ? "2px" : "0px",
                                borderRadius: 8,
                              }}
                            >
                              {logo}
                            </div>
                          )}
                        />
                      ))}
                    </Inline>
                  </RadioGroup>
                </Stack>

                <IconButton
                  aria-expanded={isSheetOpen}
                  aria-haspopup="dialog"
                  disabled={isSheetOpen}
                  onPress={() => setIsSheetOpen(true)}
                  Icon={IconControlsRegular}
                />
              </Inline>

              <Inline space={40} fullWidth alignItems="flex-end">
                <textarea
                  style={{
                    border: "none",
                    width: "100%",
                    fontSize: 18,
                    resize: "none",
                    fieldSizing: "content",
                    scrollbarWidth: "none",
                    outline: "none",
                  }}
                  type="text"
                  id="name"
                  name="name"
                  placeholder="A woman jumping in front of a wall"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <Align x="end">
                  <ButtonPrimary
                    small
                    onPress={handleGenerate}
                    loading={loading}
                  >
                    Generate
                  </ButtonPrimary>
                </Align>
              </Inline>
            </Stack>
          </Box>
        </div>

        {/* Configuration Drawer with all API parameters */}
        {isSheetOpen && (
          <Drawer
            title="Configuración de la API"
            onClose={() => setIsSheetOpen(false)}
            button={{
              text: "Aplicar",
              onPress: () => setIsSheetOpen(false),
            }}
            secondaryButton={{
              text: "Cancelar",
              onPress: () => setIsSheetOpen(false),
            }}
            onDismiss={() => setIsSheetOpen(false)}
          >
            <Stack space={24}>
              {/* Model Selection */}
              <div>
                <Text
                  variant="body1"
                  style={{ marginBottom: 12, fontWeight: "bold" }}
                >
                  Modelo
                </Text>
                <RadioGroup
                  name="model-group"
                  value={model}
                  onChange={setModel}
                >
                  <Stack space={8}>
                    {modelOptions.map((option) => (
                      <RadioButton
                        key={option.value}
                        value={option.value}
                        render={({ labelId }) => (
                          <Text id={labelId}>{option.label}</Text>
                        )}
                      />
                    ))}
                  </Stack>
                </RadioGroup>
              </div>

              {/* Aspect Ratio Selection */}
              <div>
                <Text
                  variant="body1"
                  style={{ marginBottom: 12, fontWeight: "bold" }}
                >
                  Relación de aspecto
                </Text>
                <RadioGroup
                  name="aspect-ratio-group"
                  value={aspectRatio}
                  onChange={setAspectRatio}
                >
                  <Stack space={8}>
                    {aspectRatioOptions.map((option) => (
                      <RadioButton
                        key={option.value}
                        value={option.value}
                        render={({ labelId }) => (
                          <Text id={labelId}>{option.label}</Text>
                        )}
                      />
                    ))}
                  </Stack>
                </RadioGroup>
              </div>

              {/* Megapixels Selection */}
              <div>
                <Text
                  variant="body1"
                  style={{ marginBottom: 12, fontWeight: "bold" }}
                >
                  Megapíxeles
                </Text>
                <RadioGroup
                  name="megapixels-group"
                  value={megapixels}
                  onChange={setMegapixels}
                >
                  <Stack space={8}>
                    {megapixelOptions.map((option) => (
                      <RadioButton
                        key={option.value}
                        value={option.value}
                        render={({ labelId }) => (
                          <Text id={labelId}>{option.label}</Text>
                        )}
                      />
                    ))}
                  </Stack>
                </RadioGroup>
              </div>

              {/* Output Format Selection */}
              <div>
                <Text
                  variant="body1"
                  style={{ marginBottom: 12, fontWeight: "bold" }}
                >
                  Formato de salida
                </Text>
                <RadioGroup
                  name="output-format-group"
                  value={outputFormat}
                  onChange={setOutputFormat}
                >
                  <Stack space={8}>
                    {outputFormatOptions.map((option) => (
                      <RadioButton
                        key={option.value}
                        value={option.value}
                        render={({ labelId }) => (
                          <Text id={labelId}>{option.label}</Text>
                        )}
                      />
                    ))}
                  </Stack>
                </RadioGroup>
              </div>

              {/* Go Fast Toggle */}
              <div>
                <Text
                  variant="body1"
                  style={{ marginBottom: 12, fontWeight: "bold" }}
                >
                  Generación rápida
                </Text>
                <RadioGroup
                  name="go-fast-group"
                  value={goFast.toString()}
                  onChange={(value) => setGoFast(value === "true")}
                >
                  <Stack space={8}>
                    <RadioButton
                      value="false"
                      render={({ labelId }) => <Text id={labelId}>Normal</Text>}
                    />
                    <RadioButton
                      value="true"
                      render={({ labelId }) => <Text id={labelId}>Rápida</Text>}
                    />
                  </Stack>
                </RadioGroup>
              </div>

              {/* Number of Outputs */}
              <div>
                <Text
                  variant="body1"
                  style={{ marginBottom: 12, fontWeight: "bold" }}
                >
                  Número de salidas: {numOutputs}
                </Text>
                <Slider
                  min={1}
                  max={4}
                  step={1}
                  value={numOutputs}
                  onChangeValue={setNumOutputs}
                />
                <Inline space="between">
                  <Text variant="body2">1</Text>
                  <Text variant="body2">4</Text>
                </Inline>
              </div>

              {/* LoRA Scale */}
              <div>
                <Text
                  variant="body1"
                  style={{ marginBottom: 12, fontWeight: "bold" }}
                >
                  LoRA Scale: {loraScale}
                </Text>
                <Slider
                  min={0}
                  max={2}
                  step={0.1}
                  value={loraScale}
                  onChangeValue={setLoraScale}
                />
                <Inline space="between">
                  <Text variant="body2">0</Text>
                  <Text variant="body2">2</Text>
                </Inline>
              </div>

              {/* Guidance Scale */}
              <div>
                <Text
                  variant="body1"
                  style={{ marginBottom: 12, fontWeight: "bold" }}
                >
                  Guidance Scale: {guidanceScale}
                </Text>
                <Slider
                  min={1}
                  max={20}
                  step={0.5}
                  value={guidanceScale}
                  onChangeValue={setGuidanceScale}
                />
                <Inline space="between">
                  <Text variant="body2">1</Text>
                  <Text variant="body2">20</Text>
                </Inline>
              </div>

              {/* Output Quality */}
              <div>
                <Text
                  variant="body1"
                  style={{ marginBottom: 12, fontWeight: "bold" }}
                >
                  Calidad de salida: {outputQuality}%
                </Text>
                <Slider
                  min={10}
                  max={100}
                  step={5}
                  value={outputQuality}
                  onChangeValue={setOutputQuality}
                />
                <Inline space="between">
                  <Text variant="body2">10%</Text>
                  <Text variant="body2">100%</Text>
                </Inline>
              </div>

              {/* Prompt Strength */}
              <div>
                <Text
                  variant="body1"
                  style={{ marginBottom: 12, fontWeight: "bold" }}
                >
                  Fuerza del prompt: {promptStrength}
                </Text>
                <Slider
                  min={0}
                  max={1}
                  step={1}
                  value={promptStrength}
                  onChangeValue={setPromptStrength}
                />
                <Inline space="between">
                  <Text variant="body2">0</Text>
                  <Text variant="body2">1</Text>
                </Inline>
              </div>

              {/* Extra LoRA Scale */}
              <div>
                <Text
                  variant="body1"
                  style={{ marginBottom: 12, fontWeight: "bold" }}
                >
                  Extra LoRA Scale: {extraLoraScale}
                </Text>
                <Slider
                  min={0}
                  max={2}
                  step={0.1}
                  value={extraLoraScale}
                  onChangeValue={setExtraLoraScale}
                />
                <Inline space="between">
                  <Text variant="body2">0</Text>
                  <Text variant="body2">2</Text>
                </Inline>
              </div>

              {/* Number of Inference Steps */}
              <div>
                <Text
                  variant="body1"
                  style={{ marginBottom: 12, fontWeight: "bold" }}
                >
                  Pasos de inferencia: {numInferenceSteps}
                </Text>
                <Slider
                  min={1}
                  max={50}
                  step={1}
                  value={numInferenceSteps}
                  onChangeValue={setNumInferenceSteps}
                />
                <Inline space="between">
                  <Text variant="body2">1</Text>
                  <Text variant="body2">50</Text>
                </Inline>
              </div>
            </Stack>
          </Drawer>
        )}
      </div>
    </ResponsiveLayout>
  );
};

export default ImageGenerator;
