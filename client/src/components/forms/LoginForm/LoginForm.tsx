import { FormEvent, useState } from "react";
import { observer } from "mobx-react-lite";
import { Box, Button, TextField, CircularProgress } from "@mui/material";
import { useStores } from "../../../stores/RootStore";
import { validateApiKey } from "../../../api/client";

export const LoginForm = observer(() => {
  const { authStore, objectStore } = useStores();
  const [value, setValue] = useState(authStore.apiKey ?? "");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    authStore.setError(null);

    const key = value.trim();
    if (!key) {
      setError("Обов'язкове поле");
      return;
    }

    authStore.setIsChecking(true);
    const ok = await validateApiKey(key);
    authStore.setIsChecking(false);

    if (!ok) {
      const error = "Невірний ключ доступу";
      authStore.setError(error);
      setError(error);

      return;
    }

    authStore.setApiKey(key);
    objectStore.startPolling(key);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <TextField
        fullWidth
        label="API ключ"
        placeholder={`Введіть ключ доступу "test-key"`}
        margin="normal"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus
        autoComplete="off"
        error={!!error}
        helperText={error || authStore.error}
      />

      <Box
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
        }}
      >
        <Button
          type="submit"
          variant="contained"
          disabled={authStore.isChecking}
          endIcon={authStore.isChecking ? <CircularProgress size={18} /> : null}
        >
          Увійти
        </Button>
      </Box>
    </Box>
  );
});
