import { Typography, Box, Container, Paper } from "@mui/material";

import { ObjectMap, ObjectList, Header } from "../components";

export const MapPage = () => {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Container maxWidth="lg" sx={{ py: 3, flexGrow: 1 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 3 }}>
          <Paper
            sx={{
              p: 2,
              minHeight: 400,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              Мапа
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Кожна точка - це об&apos;єкт. Зелений - активний, помаранчевий -
              втрачений (буде видалений через 5 хвилин після втрати).
            </Typography>
            <Box sx={{ flexGrow: 1, minHeight: { xs: 350, md: 600 } }}>
              <ObjectMap />
            </Box>
          </Paper>

          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              minHeight: 400,
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              Список об&apos;єктів
            </Typography>
            <ObjectList />
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};
