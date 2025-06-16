const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = function (app) {
  // Configuration to handle requests to /api/generate
  app.use("/api/generate", function (req, res) {
    // Handle POST request body
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      let requestBody;
      try {
        requestBody = JSON.parse(body);
      } catch (error) {
        return res.status(400).json({ error: "Formato de solicitud inválido" });
      }

      // Extract all parameters from request body with defaults
      const {
        prompt,
        model = "dev",
        aspectRatio = "16:9",
        goFast = false,
        loraScale = 1,
        megapixels = "1",
        numOutputs = 1,
        outputFormat = "png",
        guidanceScale = 3,
        outputQuality = 80,
        promptStrength = 0.8,
        extraLoraScale = 1,
        numInferenceSteps = 28,
      } = requestBody;

      if (!prompt) {
        return res.status(400).json({ error: "El prompt es obligatorio" });
      }

      // Log configuration for debugging
      console.log("API Configuration:", {
        model,
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
      });

      // Use Replicate HTTP API directly with all parameters
      fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
          Prefer: "wait",
        },
        body: JSON.stringify({
          // Usar el modelo específico de la marca si está disponible, de lo contrario usar el modelo de Movistar
          version:
            requestBody.modelVersion ||
            "yceballost/movistar-images:3e6c5b6f16e335e7508c86f13f05de7db88ab5ab1d06be2b22c1fa3039856b3f",
          input: {
            model: model,
            prompt: prompt,
            go_fast: goFast, // Now using frontend value
            lora_scale: loraScale, // Now using frontend value
            megapixels: megapixels, // Now using frontend value
            num_outputs: numOutputs, // Now using frontend value
            aspect_ratio: aspectRatio, // Already using frontend value
            output_format: outputFormat, // Now using frontend value
            guidance_scale: guidanceScale, // Now using frontend value
            output_quality: outputQuality, // Now using frontend value
            prompt_strength: promptStrength, // Now using frontend value
            extra_lora_scale: extraLoraScale, // Now using frontend value
            num_inference_steps: numInferenceSteps, // Now using frontend value
          },
        }),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              throw new Error(errorData.detail || "Error al generar la imagen");
            });
          }
          return response.json();
        })
        .then((data) => {
          // Check if the prediction failed
          if (data.status === "failed") {
            throw new Error(data.error || "Error al generar la imagen");
          }

          // Check if output is available
          if (!data.output || !data.output[0]) {
            throw new Error("No se pudo generar la imagen");
          }

          res.json({ image: data.output[0] });
        })
        .catch((error) => {
          console.error("Error:", error);
          res
            .status(500)
            .json({ error: error.message || "Error al generar la imagen" });
        });
    });
  });
};
