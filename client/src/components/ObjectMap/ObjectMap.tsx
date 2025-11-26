import { observer } from "mobx-react-lite";
import { Box, CircularProgress, Tooltip } from "@mui/material";
import { useStores } from "../../stores/RootStore";
import { getStatusConfig } from "../../helpers/getStatusConfig";

export const ObjectMap = observer(() => {
  const { objectStore } = useStores();

  const objects = objectStore.visibleObjects;

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        background:
          "radial-gradient(circle at 0 0, rgba(255,255,255,0.06), transparent 40%), " +
          "radial-gradient(circle at 100% 100%, rgba(255,255,255,0.06), transparent 40%), " +
          "linear-gradient(135deg, rgba(255,255,255,0.02), transparent 60%)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px)," +
            "linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "10% 10%",
        }}
      />

      {objectStore.isLoading && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {objects.map((obj) => {
        const left = `${obj.x}%`;
        const top = `${100 - obj.y}%`;

        const { borderColor, backgroundColor } = getStatusConfig(obj.status);

        return (
          <Tooltip
            key={obj.id}
            title={`ID: ${obj.id} | X: ${obj.x.toFixed(1)}, Y: ${obj.y.toFixed(
              1
            )} | dir: ${Math.round(obj.direction)}° | статус: ${status}`}
            arrow
          >
            <Box
              sx={{
                position: "absolute",
                left,
                top,
                transform: "translate(-50%, -50%)",
                width: 14,
                height: 14,
                borderRadius: "50%",
                border: "2px solid",
                borderColor,
                backgroundColor,
                boxShadow: "0 0 8px rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  width: 0,
                  height: 0,
                  borderLeft: "4px solid transparent",
                  borderRight: "4px solid transparent",
                  borderBottom: "8px solid rgba(0,0,0,0.85)",
                  transform: `translateY(-8px) rotate(${obj.direction}deg)`,
                  transformOrigin: "50% 100%",
                }}
              />
            </Box>
          </Tooltip>
        );
      })}
    </Box>
  );
});
