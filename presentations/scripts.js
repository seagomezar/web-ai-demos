// --- Demo Scripts ---

let demoSession = null;

async function runAvailabilityDemo() {
    const output = document.getElementById('output-availability');
    const btn = document.getElementById('btn-availability');

    output.textContent = "Verificando...";
    btn.disabled = true;

    try {
        if (!self.LanguageModel) {
            output.textContent = "Error: window.LanguageModel no está disponible.";
            return;
        }
        const availability = await self.LanguageModel.availability();
        output.textContent = `Disponibilidad: ${availability}`;
    } catch (e) {
        output.textContent = "Error: " + e.message;
    } finally {
        btn.disabled = false;
    }
}

async function runSessionDemo() {
    const output = document.getElementById('output-session');
    const btn = document.getElementById('btn-session');

    output.textContent = "Creando sesión...";
    btn.disabled = true;

    try {
        if (!self.LanguageModel) {
            output.textContent = "Error: API no disponible.";
            return;
        }

        demoSession = await self.LanguageModel.create({
            expectedInputs: [{ type: 'text', languages: ['es'] }],
            expectedOutputs: [{ type: 'text', languages: ['es'] }],
            systemPrompt: "Eres un asistente útil. Responde concisamente.",
            monitor(m) {
                m.addEventListener('downloadprogress', (e) => {
                    const percent = Math.round((e.loaded / e.total) * 100);
                    output.textContent = `Descargando modelo: ${percent}%`;
                });
            }
        });
        output.textContent = "¡Sesión creada exitosamente!";
    } catch (e) {
        output.textContent = "Error: " + e.message;
    } finally {
        btn.disabled = false;
    }
}

async function runStreamingDemo() {
    const output = document.getElementById('output-streaming');
    const btn = document.getElementById('btn-streaming');

    if (!demoSession) {
        output.textContent = "Error: Primero debes crear la sesión (Paso 2).";
        return;
    }

    output.textContent = "Generando...";
    btn.disabled = true;

    try {
        const stream = demoSession.promptStreaming("Explicame algo!");

        let firstChunk = true;
        let previousChunk = '';
        for await (const chunk of stream) {
            if (firstChunk) {
                output.textContent = "";
                firstChunk = false;
            }
            const newChunk = chunk.startsWith(previousChunk)
                ? chunk.slice(previousChunk.length) : chunk;
            output.textContent += newChunk;
            previousChunk = chunk;
        }
    } catch (e) {
        output.textContent = "Error: " + e.message;
    } finally {
        btn.disabled = false;
    }
}

// Token Counting Demo
const tokenInput = document.getElementById('token-input');
const tokenCountDisplay = document.getElementById('token-count');

if (tokenInput) {
    tokenInput.addEventListener('input', async () => {
        const text = tokenInput.value;

        try {
            if (!demoSession) {
                tokenCountDisplay.textContent = "Creando sesión automática...";
                if (!self.LanguageModel) {
                    tokenCountDisplay.textContent = "Error: API no disponible.";
                    return;
                }
                demoSession = await self.LanguageModel.create({
                    expectedInputs: [{ type: 'text', languages: ['es'] }],
                    expectedOutputs: [{ type: 'text', languages: ['es'] }],
                    systemPrompt: "Eres un asistente útil. Responde concisamente."
                });
            }

            let count;
            if (demoSession.countPromptTokens) {
                count = await demoSession.countPromptTokens(text);
            } else if (demoSession.measureInputUsage) {
                count = await demoSession.measureInputUsage(text);
            }
            tokenCountDisplay.textContent = `Tokens: ${count}`;
        } catch (e) {
            tokenCountDisplay.textContent = "Error: " + e.message;
        }
    });
}

let demoSummarizer = null;

async function runSummarizerAvailability() {
    const output = document.getElementById('output-sum-avail');
    const btn = document.getElementById('btn-sum-avail');
    output.textContent = "Verificando disponibilidad...";
    btn.disabled = true;

    try {
        if (!self.Summarizer) {
            output.textContent = "Error: self.Summarizer no está disponible.";
            return;
        }
        const availability = await self.Summarizer.availability();
        output.textContent = `Disponibilidad: ${availability}`;
    } catch (e) {
        output.textContent = "Error: " + e.message;
    } finally {
        btn.disabled = false;
    }
}

async function runSummarizerCreation() {
    const output = document.getElementById('output-sum-create');
    const btn = document.getElementById('btn-sum-create');
    output.textContent = "Creando Summarizer...";
    btn.disabled = true;

    try {
        if (!self.Summarizer) throw new Error("API no encontrada");

        demoSummarizer = await self.Summarizer.create({
            format: 'plain-text',
            monitor(m) {
                m.addEventListener('downloadprogress', (e) => {
                    const percent = Math.round((e.loaded / e.total) * 100);
                    output.textContent = `Descargando modelo: ${percent}%`;
                });
            }
        });
        output.textContent = "¡Summarizer creado exitosamente!";
    } catch (e) {
        output.textContent = "Error: " + e.message;
    } finally {
        btn.disabled = false;
    }
}

async function runSummarizerExecution() {
    const output = document.getElementById('output-sum-exec');
    const btn = document.getElementById('btn-sum-exec');
    const input = document.getElementById('input-sum');

    if (!demoSummarizer) {
        output.textContent = "Error: Primero crea el Summarizer (Paso 2).";
        return;
    }

    output.textContent = "Resumiendo...";
    btn.disabled = true;

    try {
        const summary = await demoSummarizer.summarize(input.value);
        output.textContent = "Resumen: " + summary;
    } catch (e) {
        output.textContent = "Error: " + e.message;
    } finally {
        btn.disabled = false;
    }
}

let demoDetector = null;

async function runLangDetectAvailability() {
    const output = document.getElementById('output-lang-avail');
    const btn = document.getElementById('btn-lang-avail');
    output.textContent = "Verificando disponibilidad...";
    btn.disabled = true;

    try {
        // Modern API
        if (self.LanguageDetector) {
            const capabilities = await self.LanguageDetector.capabilities();
            output.textContent = `Disponibilidad (Modern): ${capabilities.available}`;
            return;
        }

        // Legacy API
        if (self.ai && self.ai.languageDetector) {
            const availability = await self.ai.languageDetector.availability();
            // Handle object or string return
            const status = typeof availability === 'object' ? availability.available : availability;
            output.textContent = `Disponibilidad (Legacy): ${status}`;
            return;
        }

        output.textContent = "Error: API de detección de idioma no encontrada (LanguageDetector).";
    } catch (e) {
        output.textContent = "Error: " + e.message;
    } finally {
        btn.disabled = false;
    }
}

async function runLangDetectCreation() {
    const output = document.getElementById('output-lang-create');
    const btn = document.getElementById('btn-lang-create');
    const progressBar = document.getElementById('progress-lang-create');

    output.textContent = "Creando detector...";
    btn.disabled = true;
    progressBar.style.width = '0%';

    try {
        const monitorConfig = {
            monitor(m) {
                m.addEventListener('downloadprogress', (e) => {
                    const percent = Math.round((e.loaded / e.total) * 100);
                    progressBar.style.width = `${percent}%`;
                    output.textContent = `Descargando modelo: ${percent}%`;
                });
            }
        };

        // Modern API
        if (self.LanguageDetector) {
            demoDetector = await self.LanguageDetector.create(monitorConfig);
        }
        // Legacy API
        else if (self.ai && self.ai.languageDetector) {
            demoDetector = await self.ai.languageDetector.create(monitorConfig);
        } else {
            throw new Error("API no encontrada (LanguageDetector)");
        }

        progressBar.style.width = '100%';
        output.textContent = "¡Detector creado exitosamente!";
    } catch (e) {
        output.textContent = "Error: " + e.message;
        progressBar.style.backgroundColor = '#ff5555';
    } finally {
        btn.disabled = false;
    }
}

async function runLangDetectExecution() {
    const output = document.getElementById('output-lang-exec');
    const btn = document.getElementById('btn-lang-exec');
    const input = document.getElementById('input-lang-exec');

    if (!demoDetector) {
        output.textContent = "Error: Primero crea el detector (Paso 2).";
        return;
    }

    output.textContent = "Detectando...";
    btn.disabled = true;

    try {
        const results = await demoDetector.detect(input.value);
        output.textContent = JSON.stringify(results, null, 2);
    } catch (e) {
        output.textContent = "Error: " + e.message;
    } finally {
        btn.disabled = false;
    }
}

let demoWriter = null;

async function runWriterAvailability() {
    const output = document.getElementById('output-writer-avail');
    const btn = document.getElementById('btn-writer-avail');
    output.textContent = "Verificando...";
    btn.disabled = true;

    try {
        let availability = 'no';

        // Modern API
        if (self.Writer) {
            availability = await self.Writer.availability();
        }
        // Legacy API
        else if (self.ai && self.ai.writer) {
            availability = await self.ai.writer.availability();
        } else {
            output.textContent = "API Writer no soportada en este navegador.";
            return;
        }

        output.textContent = `Disponibilidad: ${availability}`;

        if (availability === 'unavailable') {
            output.textContent += " (Intenta habilitar las flags)";
        }
    } catch (e) {
        output.textContent = "Error: " + e.message;
    } finally {
        btn.disabled = false;
    }
}
async function runWriterCreation() {
    const output = document.getElementById('output-writer-create');
    const btn = document.getElementById('btn-writer-create');
    const progressBar = document.getElementById('progress-writer-create');

    output.textContent = "Creando Writer...";
    btn.disabled = true;
    progressBar.style.width = '0%';

    try {
        const monitorConfig = {
            monitor(m) {
                m.addEventListener('downloadprogress', (e) => {
                    const percent = Math.round((e.loaded / e.total) * 100);
                    progressBar.style.width = `${percent}%`;
                    output.textContent = `Descargando modelo: ${percent}%`;
                });
            }
        };

        // Modern API
        if (self.Writer) {
            demoWriter = await self.Writer.create({
                tone: 'formal',
                ...monitorConfig
            });
        }
        // Legacy API
        else if (self.ai && self.ai.writer) {
            demoWriter = await self.ai.writer.create({
                tone: 'formal',
                ...monitorConfig
            });
        } else {
            throw new Error("API no encontrada");
        }

        progressBar.style.width = '100%';
        output.textContent = "¡Writer creado exitosamente!";
    } catch (e) {
        output.textContent = "Error: " + e.message;
        progressBar.style.backgroundColor = '#ff5555';
    } finally {
        btn.disabled = false;
    }
}

async function runWriterExecution() {
    const output = document.getElementById('output-writer-exec');
    const btn = document.getElementById('btn-writer-exec');
    const input = document.getElementById('input-writer-exec');

    if (!demoWriter) {
        output.textContent = "Error: Primero crea el Writer (Paso 2).";
        return;
    }

    output.textContent = "Escribiendo...";
    btn.disabled = true;

    try {
        const stream = await demoWriter.writeStreaming(input.value);
        let fullText = "";
        output.textContent = "";
        for await (const chunk of stream) {
            fullText += chunk;
            output.textContent = fullText;
        }
    } catch (e) {
        output.textContent = "Error: " + e.message;
    } finally {
        btn.disabled = false;
    }
}

let demoRewriter = null;

async function runRewriterAvailability() {
    const output = document.getElementById('output-rewriter-avail');
    const btn = document.getElementById('btn-rewriter-avail');
    output.textContent = "Verificando...";
    btn.disabled = true;

    try {
        let availability = 'no';

        // Modern API
        if (self.Rewriter) {
            availability = await self.Rewriter.availability();
        }
        // Legacy API
        else if (self.ai && self.ai.rewriter) {
            availability = await self.ai.rewriter.availability();
        } else {
            output.textContent = "API Rewriter no soportada en este navegador.";
            return;
        }

        output.textContent = `Disponibilidad: ${availability}`;

        if (availability === 'unavailable') {
            output.textContent += " (Intenta habilitar las flags)";
        }
    } catch (e) {
        output.textContent = "Error: " + e.message;
    } finally {
        btn.disabled = false;
    }
}

async function runRewriterCreation() {
    const output = document.getElementById('output-rewriter-create');
    const btn = document.getElementById('btn-rewriter-create');
    const progressBar = document.getElementById('progress-rewriter-create');

    output.textContent = "Creando Rewriter...";
    btn.disabled = true;
    progressBar.style.width = '0%';

    try {
        const monitorConfig = {
            monitor(m) {
                m.addEventListener('downloadprogress', (e) => {
                    const percent = Math.round((e.loaded / e.total) * 100);
                    progressBar.style.width = `${percent}%`;
                    output.textContent = `Descargando modelo: ${percent}%`;
                });
            }
        };

        const createOptions = {
            tone: 'more-formal',
            length: 'shorter',
            ...monitorConfig
        };

        // Modern API
        if (self.Rewriter) {
            demoRewriter = await self.Rewriter.create(createOptions);
        }
        // Legacy API
        else if (self.ai && self.ai.rewriter) {
            demoRewriter = await self.ai.rewriter.create(createOptions);
        } else {
            throw new Error("API no encontrada");
        }

        progressBar.style.width = '100%';
        output.textContent = "¡Rewriter creado exitosamente!";
    } catch (e) {
        output.textContent = "Error: " + e.message;
        progressBar.style.backgroundColor = '#ff5555';
    } finally {
        btn.disabled = false;
    }
}

async function runRewriterExecution() {
    const output = document.getElementById('output-rewriter-exec');
    const btn = document.getElementById('btn-rewriter-exec');
    const input = document.getElementById('input-rewriter-exec');
    const context = document.getElementById('context-rewriter-exec');

    if (!demoRewriter) {
        output.textContent = "Error: Primero crea el Rewriter (Paso 2).";
        return;
    }

    output.textContent = "Reescribiendo...";
    btn.disabled = true;

    try {
        const stream = await demoRewriter.rewriteStreaming(input.value, { context: context.value });
        let fullText = "";
        output.textContent = "";
        for await (const chunk of stream) {
            fullText += chunk;
            output.textContent = fullText;
        }
    } catch (e) {
        output.textContent = "Error: " + e.message;
    } finally {
        btn.disabled = false;
    }
}

async function doCloudSummarization(text) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve("Resumen desde la nube: La vida es bella (simulado).");
        }, 1000);
    });
}

async function runAdvancedSummarizerDemo() {
    const output = document.getElementById('output-sum-adv');
    const btn = document.getElementById('btn-sum-adv');

    output.textContent = "Iniciando demo avanzada...";
    btn.disabled = true;

    try {
        const options = { type: "teaser", expectedInputLanguages: ["ja"] };

        if (!self.Summarizer) {
            output.textContent = "API Summarizer no disponible. Usando nube...";
            const cloudResult = await doCloudSummarization("La vida es bella");
            output.textContent = cloudResult;
            return;
        }

        const availability = await self.Summarizer.availability(options);
        output.textContent = `Disponibilidad: ${availability}\n`;

        if (availability !== "unavailable") {
            if (availability !== "available") {
                output.textContent += "Descargando modelo...\n";
            }

            const summarizer = await self.Summarizer.create(options);
            const result = await summarizer.summarize("La vida es bella");
            output.textContent += `Resumen local: ${result}`;
        } else {
            output.textContent += "Modelo local no disponible. Usando nube...\n";
            const cloudResult = await doCloudSummarization("La vida es bella");
            output.textContent += cloudResult;
        }
    } catch (e) {
        output.textContent += "Error: " + e.message;
    } finally {
        btn.disabled = false;
    }
}
