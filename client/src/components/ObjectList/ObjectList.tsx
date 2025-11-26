import { observer } from "mobx-react-lite";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Typography,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { useStores } from "../../stores/RootStore";
import { getStatusConfig } from "../../helpers/getStatusConfig";

export const ObjectList = observer(() => {
  const { objectStore } = useStores();

  const objects = objectStore.allObjects;

  if (!objects.length) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Немає даних. Очікуємо на оновлення від сервера...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, overflow: "auto" }}>
      <List dense>
        {objects.map((obj) => {
          const { label, chipColor, iconColor } = getStatusConfig(obj.status);

          return (
            <Box key={obj.id}>
              <ListItem
                divider
                secondaryAction={
                  <Chip size="small" label={label} color={chipColor} />
                }
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CircleIcon fontSize="small" color={iconColor} />
                </ListItemIcon>
                <ListItemText
                  primary={`ID: ${obj.id}`}
                  secondary={`X: ${obj.x.toFixed(1)}, Y: ${obj.y.toFixed(
                    1
                  )} | напрям: ${Math.round(obj.direction)}°`}
                />
              </ListItem>
            </Box>
          );
        })}
      </List>
    </Box>
  );
});
