const fs = require('fs');
const path = 'src/pages/client/ContactPage.jsx';
let content = fs.readFileSync(path, 'utf8');

const newCode = `  const handleSubmit = async (e) => {
    e.preventDefault();
    setUiState((prev) => ({ ...prev, isSubmitting: true }));
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      await axios.post(\`\${baseUrl}/api/messages\`, formData);
      setUiState((prev) => ({ ...prev, isSubmitting: false, isSubmitted: true }));
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setUiState((prev) => ({ ...prev, isSubmitted: false })), 5000);
    } catch (error) {
      console.error("Failed to submit message:", error);
      setUiState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleChatSend`;

// Split content by const handleSubmit
const parts1 = content.split("const handleSubmit =");
const prefix = parts1[0];
const remaining = parts1[1];
const parts2 = remaining.split("const handleChatSend");
const suffix = parts2[1];

if (parts1.length === 2 && parts2.length === 2) {
    fs.writeFileSync(path, prefix + newCode + suffix, 'utf8');
    console.log("Success! File replaced and handles newline differences.");
} else {
    console.log("Failed to find boundaries in ContactPage.jsx");
}
