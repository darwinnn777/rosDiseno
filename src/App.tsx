
import { ConfigProvider } from './contexts/ConfigContext';
import { AppLayout } from './components/layout/AppLayout';
import { ConfigPanel } from './components/ConfigPanel/ConfigPanel';
import { ViewerContainer } from './components/Viewer/ViewerContainer';

function App() {
  return (
    <ConfigProvider>
      <AppLayout sidebar={<ConfigPanel />}>
        <ViewerContainer />
      </AppLayout>
    </ConfigProvider>
  );
}

export default App;
