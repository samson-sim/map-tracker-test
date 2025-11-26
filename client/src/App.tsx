import { observer } from "mobx-react-lite";
import { useStores } from "./stores/RootStore";
import { LoginPage } from "./pages/LoginPage";
import { MapPage } from "./pages/MapPage";

export const App = observer(() => {
  const { authStore } = useStores();

  if (!authStore.isAuthenticated) {
    return <LoginPage />;
  }

  return <MapPage />;
});
