import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Chip,
  Stack,
  Tooltip,
} from "@mui/material";
import { Logout, Refresh } from "@mui/icons-material";
import { useStores } from "../../stores/RootStore";
import { observer } from "mobx-react-lite";

export const Header = observer(() => {
  const { authStore, objectStore } = useStores();

  const handleLogout = () => {
    objectStore.stopPolling();
    authStore.logout();
  };

  const handleManualRefresh = () => {
    objectStore.loadOnce();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Map Tracker
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mr: 2 }}>
          <Chip
            label={`Активні: ${objectStore.activeObjects.length}`}
            color="success"
          />
          <Chip
            label={`Втрачені: ${objectStore.lostObjects.length}`}
            color="warning"
          />
          <Chip
            label={`Вилучені: ${objectStore.removedObjects.length}`}
            color="error"
          />
        </Stack>
        <Tooltip title="Оновити">
          <IconButton color="inherit" onClick={handleManualRefresh}>
            <Refresh />
          </IconButton>
        </Tooltip>
        <Tooltip title="Вийти">
          <IconButton color="inherit" onClick={handleLogout}>
            <Logout />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
});
