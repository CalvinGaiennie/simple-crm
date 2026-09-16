import { isSupabaseConfigured } from "./supabaseClient";
import ConnectedApp from "./ConnectedApp";
import DemoApp from "./DemoApp";

export default function App() {
  return isSupabaseConfigured ? <ConnectedApp /> : <DemoApp />;
}
