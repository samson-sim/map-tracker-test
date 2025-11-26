import { Box, Container, Paper, Typography } from "@mui/material";

import { LoginForm } from "../components/forms";

export const LoginPage = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
        <Paper sx={{ p: 4, width: "100%" }} elevation={3}>
          <Typography variant="h5" gutterBottom>
            Авторизація по ключу
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Введіть ваш унікальний ключ доступу до системи.
          </Typography>

          <LoginForm />
        </Paper>
      </Box>
    </Container>
  );
};
