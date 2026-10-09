import { ofetch } from "ofetch";
(async () => {
  try {
    await ofetch("http://localhost:8000/api/v1/auth/register", {
      method: "POST",
      body: { name: "Test", email: "test@example.com", password: "Password123!" }
    });
    // Run it again to trigger the "already exists" error
    await ofetch("http://localhost:8000/api/v1/auth/register", {
      method: "POST",
      body: { name: "Test", email: "test@example.com", password: "Password123!" }
    });
  } catch (error) {
    console.log("error.data:", error.data);
    console.log("error.response?.data:", error.response?.data);
    console.log("error.response?._data:", error.response?._data);
    console.log("error.message:", error.message);
  }
})();
